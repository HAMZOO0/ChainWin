/* TODO
 # 1 Buy ticket  (pay some ammount )
 # 2 Pick random player as a winner (verifiable random)
 # 3 Winner selected in x ammount of time  - ( completly automated)
 # 4 Chainlink --> Randomness , Automaed execution - (ChainLink Keeper)
 */

// SPDX-License-Identifier:MIT
pragma solidity ^0.8.28;

/*imports */
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol"; // for chainlink keeper

/*error */
error Lottery__NotEnoughETHForEntranceFee();
error WinnerTransferFailed();
error Lottery__NotOpen();

// inhareting the VRFConsumerBaseV2 class
contract Lottery is VRFConsumerBaseV2Plus, AutomationCompatibleInterface {
    // Type declarations
    enum LotteryState {
        OPEN,
        CALCULATING
    }

    address payable[] private s_players; // when we find winner then we pay them so it is payable
    uint256 private immutable i_entranceFee;
    LotteryState private s_lotteryState;

    //* Chainlink VRF config
    /// @notice The subscription ID for Chainlink VRF, used to identify the VRF subscription.
    /// @notice The key hash for Chainlink VRF, used to specify the gas lane for randomness requests.
    /// @notice The gas limit for the callback function when fulfilling randomness, set to 100,000.
    /// @notice The number of block confirmations required before the VRF response is considered valid.
    /// @notice The number of random words to request from Chainlink VRF, set to 1 for a single winner.
    /// @notice Stores the most recent VRF request ID for tracking randomness requests.
    /// @notice Stores the address of the most recent lottery winner.

    uint64 private immutable i_subscriptionId; // after subscription ,subscription id will genrate
    bytes32 private immutable i_keyHash; // also find under the address of sepolia vrf
    uint32 private constant CALLBACK_GAS_LIMIT = 100000;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    uint256 private s_requestId;
    address private s_recentWinner;

    //* Chainlink Keeper config
    uint256 private s_lastTimeStamp;
    uint256 private immutable i_interval;

    /* Events */
    event TicketBought(address indexed player);
    event RequestLotteryWinner(uint256 indexed requestId); // request id
    event WinnerPicked(address indexed playerIndex);

    /* constructor */
    constructor(
        uint256 entranceFee,
        address vrfCoordinator,
        uint64 subscriptionId,
        bytes32 keyHash
    )
        VRFConsumerBaseV2Plus(vrfCoordinator) // address of sepolia vrf
    {
        i_entranceFee = entranceFee;
        i_subscriptionId = subscriptionId;
        i_keyHash = keyHash;

        // keepers
        i_interval = 60; // 60 sec
        s_lastTimeStamp = block.timestamp;
        s_lotteryState = LotteryState.OPEN;
    }

    /* buyTicket */
    function buyTicket() public payable {
        // Revert if not enough ETH sent for player
        if (msg.value < i_entranceFee) {
            revert Lottery__NotEnoughETHForEntranceFee();
        }
        if (s_lotteryState != LotteryState.OPEN) {
            revert Lottery__NotOpen();
        }
        s_players.push(payable(msg.sender));
        emit TicketBought(msg.sender);
    }

    /*
     *  @dev Chainlink keeper nodes call this off-chain to check if work is needed
     *  work needed if :  if the timestamp is greater then interval ( 60 sec) && player list is not empty && balance is greater then 0
     *  lotter is in open state
     */
    function checkUpkeep(
        bytes calldata /*checkData*/
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory /* performData */)
    {
        bool isTime = (block.timestamp - s_lastTimeStamp) > i_interval;
        bool hasPlayers = s_players.length > 0;
        bool hasBalance = address(this).balance > 0;

        upkeepNeeded = isTime && hasPlayers && hasBalance;
    }

    function performUpkeep(bytes calldata /*performData*/) external override {
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded) {
            revert("Upkeep not needed");
        }
        s_lastTimeStamp = block.timestamp; // update the last time stamp ;
        requestRandomWinner();
    }

    /* requestRandomWinner */
    function requestRandomWinner() external {
        // Request randomness and wait for callback

        s_lotteryState = LotteryState.CALCULATING; // here our state change and it open after fulfillRandomWords

        s_requestId = s_vrfCoordinator.requestRandomWords( // it return requst id  - and it send the requst
                VRFV2PlusClient.RandomWordsRequest({ // here we are setting up the requst
                        keyHash: i_keyHash,
                        subId: i_subscriptionId,
                        requestConfirmations: REQUEST_CONFIRMATIONS,
                        callbackGasLimit: CALLBACK_GAS_LIMIT,
                        numWords: NUM_WORDS,
                        extraArgs: VRFV2PlusClient._argsToBytes(
                            VRFV2PlusClient.ExtraArgsV1({nativePayment: true})
                        )
                    })
            );
        emit RequestLotteryWinner(s_requestId);
    }

    /*  inhareted and overrided the fulfillRandomWords virtual function from VRFConsumerBaseV2  */
    function fulfillRandomWords(
        uint256 /*requstId*/,
        uint256[] calldata randomWords
    ) internal override {
        uint256 winnerIndex = randomWords[0] % s_players.length;
        address payable winner = s_players[winnerIndex];
        s_recentWinner = winner;

        s_lotteryState = LotteryState.OPEN;
        (bool success, ) = winner.call{value: address(this).balance}("");
        // require(success, "Winner Transfer Failed ");
        if (!success) {
            revert WinnerTransferFailed();
        }
        emit WinnerPicked(winner); //?  if it not work then replace with s_recentWinner
    }

    // -------------------
    //  Getters
    // -------------------
    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }
    function getPlayers(uint256 index) public view returns (address) {
        return s_players[index];
    }
    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }
}
