// Raffle
// # 1 Buy ticket  (pay some ammount )
// # 2 Pick random player as a winner (verifiable random)
// # 3 Winner selected in x ammount of time  - ( completly automated)
// # 4 Chainlink --> Randomness , Automaed execution - (ChainLink Keeper)

// SPDX-License-Identifier:MIT
pragma solidity ^0.8.28;

// import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
// import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
// import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

error Lottery__NotEnoughETHForEntranceFee();

// inhareting the VRFConsumerBaseV2 class
contract Lottery is VRFConsumerBaseV2Plus {
    address payable[] private s_players; // when we find winner then we pay them so it is payable
    uint256 private immutable i_entranceFee;

    /* Events */
    event TicketBought(address indexed player);

    /* constructor */
    constructor(
        uint256 entranceFee,
        address vrfCoordinator
    ) VRFConsumerBaseV2Plus(vrfCoordinator) {
        i_entranceFee = entranceFee;
    }

    /* buyTicket */
    function buyTicket() public payable {
        // msg.value < i_entranceFee | if sender have not enough eth so it cause error message
        if (msg.value < i_entranceFee) {
            revert Lottery__NotEnoughETHForEntranceFee();
        } else {
            s_players.push(payable(msg.sender));
            emit TicketBought(msg.sender);
        }
    }

    /* pickRandomWinner */

    function pickRandomWinner() external {
        //reqest the rendom number
        // after getting it do some logic on it
        // it is based on 2 transection process
    }
    /* ] inhareted and overrided the fulfillRandomWords virtual function from VRFConsumerBaseV2  */
    function fulfillRandomWords(
        uint256 requestId,
        uint256[] calldata randomWords
    ) internal override {}
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
