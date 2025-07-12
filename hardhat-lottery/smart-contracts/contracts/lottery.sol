/* TODO
 # 1 Buy ticket  (pay some amount)
 # 2 Pick random player as a winner (verifiable random)
 # 3 Winner selected in x amount of time  - (completely automated)
 # 4 Chainlink --> Randomness, Automated execution - (ChainLink Keeper)
 */

// SPDX-License-Identifier:MIT
pragma solidity ^0.8.28;

/*imports */
import "hardhat/console.sol"; // testing logs
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol"; // for chainlink keeper
// import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

/*error */
error Lottery__NotEnoughETHForEntranceFee();
error Lottery__WinnerTransferFailed();
error Lottery__NotOpen();
error Lottery__UpkeepNotNeeded();

/*
 * @title    A lottery smart contract
 * @author   Hamza Sajid
 * @notice   Creating a lottery system which is totally automated, decentralized, and untamperable.
 * @dev      Uses Chainlink VRF for randomness and Chainlink Keeper for automation.
 */

// inhareting the VRFConsumerBaseV2 class
contract Lottery is VRFConsumerBaseV2Plus, AutomationCompatibleInterface {
    // Type declarations
    enum LotteryState {
        OPEN,
        CALCULATING
    }

    /*
     *Chainlink VRF config
     * @notice The subscription ID for Chainlink VRF, used to identify the VRF subscription.
     * @notice The key hash for Chainlink VRF, used to specify the gas lane for randomness requests.
     * @notice The gas limit for the callback function when fulfilling randomness, set to 100,000.
     * @notice The number of block confirmations required before the VRF response is considered valid.
     * @notice The number of random words to request from Chainlink VRF, set to 1 for a single winner.
     * @notice Stores the most recent VRF request ID for tracking randomness requests.

     * @notice Stores the address of the most recent lottery winner.

     */

    uint256 private immutable i_subscriptionId; // after subscription ,subscription id will genrate
    bytes32 private immutable i_keyHash; // also find under the address of sepolia vrf
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    uint256 private s_requestId;
    address private s_recentWinner;

    address payable[] private s_players; // when we find winner then we pay them so it is payable
    uint256 private immutable i_entranceFee;
    LotteryState private s_lotteryState;

    // Chainlink Keeper config
    uint256 private s_lastTimeStamp;
    uint256 private immutable i_interval;

    /* Events */
    event TicketBought(address indexed player);
    event RequestLotteryWinner(uint256 indexed requestId); // request id
    event WinnerPicked(address indexed playerIndex);
    event DebugTicketValues(uint256 msgValue, uint256 entranceFee);

    /* constructor */
    constructor(
        address vrfCoordinator,
        uint256 entranceFee,
        uint256 subscriptionId,
        bytes32 keyHash,
        uint32 callBackGasLimit
    )
        VRFConsumerBaseV2Plus(vrfCoordinator) // address of sepolia vrf
    {
        i_entranceFee = entranceFee;
        i_subscriptionId = subscriptionId;
        i_keyHash = keyHash;
        i_callbackGasLimit = callBackGasLimit;
        //!  i_gasLane = gasLane;

        // keepers
        i_interval = 30; // 30 sec
        s_lastTimeStamp = block.timestamp;
        s_lotteryState = LotteryState.OPEN;
    }

    /* buyTicket */
    function buyTicket() public payable {
        // Revert if not enough ETH sent for player
        if (msg.value < i_entranceFee) {
            revert Lottery__NotEnoughETHForEntranceFee();
        }
        // require(msg.value > i_entranceFee, "Not Enough ETH For Entrance Fee");

        if (s_lotteryState != LotteryState.OPEN) {
            revert Lottery__NotOpen();
        }
        s_players.push(payable(msg.sender));

        emit TicketBought(msg.sender);
    }

    /* requestRandomWinner */
    function requestRandomWinner() public {
        // Request randomness and wait for callback

        s_lotteryState = LotteryState.CALCULATING; // here our state change and it open after fulfillRandomWords

        s_requestId = s_vrfCoordinator.requestRandomWords( // it return requst id  - and it send the requst
                VRFV2PlusClient.RandomWordsRequest({ // here we are setting up the requst
                        keyHash: i_keyHash,
                        subId: i_subscriptionId,
                        requestConfirmations: REQUEST_CONFIRMATIONS,
                        callbackGasLimit: i_callbackGasLimit,
                        numWords: NUM_WORDS,
                        extraArgs: VRFV2PlusClient._argsToBytes(
                            VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
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
        s_players = new address payable[](0);
        s_lastTimeStamp = block.timestamp;
        (bool success, ) = winner.call{value: address(this).balance}("");
        if (!success) {
            revert Lottery__WinnerTransferFailed();
        }
        emit WinnerPicked(winner);
    }

    /*
     *  @dev Chainlink keeper nodes call this off-chain to check if work is needed
     * they look for `upkeepNeeded` to return True.
     * the following should be true for this to return true:
     * 1. The time interval has passed between raffle runs.
     * 2. The lottery is open.
     * 3. The contract has ETH.
     * 4. Implicity, your subscription is funded with LINK.
     */
    function checkUpkeep(
        bytes memory /*checkData*/
    )
        public
        view
        override
        returns (bool upkeepNeeded, bytes memory /* performData */)
    {
        bool isTime = (block.timestamp - s_lastTimeStamp) > i_interval;
        bool hasPlayers = s_players.length > 0;
        bool hasBalance = address(this).balance > 0;
        bool isOpen = s_lotteryState == LotteryState.OPEN;

        upkeepNeeded = isTime && hasPlayers && hasBalance && isOpen;
    }

    function performUpkeep(bytes calldata /*performData*/) external override {
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded) {
            revert Lottery__UpkeepNotNeeded();
        }
        s_lastTimeStamp = block.timestamp; // update the last time stamp ;
        requestRandomWinner();
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
    function getLotteryState() public view returns (LotteryState) {
        return s_lotteryState;
    }
    // NUM_WORDS is constant so we are fetching it form abi not from storage so we use pure not view :)
    function getNumWords() public pure returns (uint32) {
        return NUM_WORDS;
    }

    function getNumberOfPlayers() public view returns (uint256) {
        return s_players.length;
    }

    function getLastestTimeStamp() public view returns (uint256) {
        return s_lastTimeStamp;
    }

    function getSubscriptionId() public view returns (uint256) {
        return i_subscriptionId;
    }
    function test_setStateToCalculating() public {
        s_lotteryState = LotteryState.CALCULATING;
    }
}
