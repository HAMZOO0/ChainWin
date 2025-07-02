// Raffle
// # 1 Buy ticket  (pay some ammount )
// # 2 Pick random player as a winner (verifiable random)
// # 3 Winner selected in x ammount of time  - ( completly automated)
// # 4 Chainlink --> Randomness , Automaed execution - (ChainLink Keeper)

// SPDX-License-Identifier:MIT
pragma solidity ^0.8.28;

error Lottery__NotEnoughETHForEntranceFee();

contract Lottery {
    address payable[] private s_players; // when we find winner then we pay them so it is payable
    uint256 private immutable i_entranceFee;


    /* Events */
    event TicketBought ( address indexed player){}

    /* constructor */
    constructor(uint256 entranceFee) {
        i_entranceFee = entranceFee;
    }

    /* buyTicket */
    function buyTicket() public payable {
        // msg.value < i_entranceFee | if sender have not enough eth so it cause error message
        if (msg.value < i_entranceFee) {
            revert Lottery__NotEnoughETHForEntranceFee();
        } else {
            s_players.push(payable(msg.sender));
            emit TicketBought (msg.sender);
        }
    }
    function pickRandomWinner() public {}

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
