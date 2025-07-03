// Raffle
// # 1 Buy ticket  (pay some ammount )
// # 2 Pick random player as a winner (verifiable random)
// # 3 Winner selected in x ammount of time  - ( completly automated)
// # 4 Chainlink --> Randomness , Automaed execution - (ChainLink Keeper)

// SPDX-License-Identifier:MIT
pragma solidity ^0.8.28;

/*imports */
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

/*error */

error Lottery__NotEnoughETHForEntranceFee();

// inhareting the VRFConsumerBaseV2 class
contract Lottery is VRFConsumerBaseV2Plus {
    address payable[] private s_players; // when we find winner then we pay them so it is payable
    uint256 private immutable i_entranceFee;
    // VRFCoordinatorV2PlusInterface public s_vrfCoordinator;

    // * Chainlink VRF config
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

    /* Events */
    event TicketBought(address indexed player);
    event RequstLotteryWinner(uint256 indexed requstId); // requst id
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
    }

    /* buyTicket */
    function buyTicket() public payable {
        // msg.value < i_entranceFee | if sender have not enough eth so it cause error message
        if (msg.value < i_entranceFee) {
            revert Lottery__NotEnoughETHForEntranceFee();
        }
        s_players.push(payable(msg.sender));
        emit TicketBought(msg.sender);
    }

    /* requstRandomWinner */

    function requstRandomWinner() external {
        //reqest the rendom number
        // after getting it do some logic on it
        // it is based on 2 transection process
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
        emit RequstLotteryWinner(s_requestId);
    }

    /*  inhareted and overrided the fulfillRandomWords virtual function from VRFConsumerBaseV2  */
    function fulfillRandomWords(
        uint256,
        uint256[] calldata randomWords
    ) internal override {
        uint256 winnerIndex = randomWords[0] % s_players.length;
        address payable winner = s_players[winnerIndex];
        s_recentWinner = winner;

        (bool success, ) = winner.call{value: address(this).balance}("");
        require(success, "Transfer failed");
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
}
