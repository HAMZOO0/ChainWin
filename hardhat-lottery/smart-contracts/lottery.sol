// Raffle
// # 1 Buy ticket  (pay some ammount )
// # 2 Pick random player as a winner (verifiable random)
// # 3 Winner selected in x ammount of time  - ( completly automated)
// # 4 Chainlink --> Randomness , Automaed execution - (ChainLink Keeper)

// SPDX-License-Identifier:MIT
pragma solidity ^0.8.28;

error Lottery__NotEnoughETHForEntranceFee();

contract Lottery {
    uint256 private immutable i_entranceFee;

    constructor(uint256 entranceFee) {
        i_entranceFee = entranceFee;
    }

    function buyTicket() {
        // msg.value < i_entranceFee | if sender have not enough eth so it cause error message
        if (msg.value < i_entranceFee) {
            revert Lottery__NotEnoughETHForEntranceFee();
        } else {}
    }
    function pickRandomWinner() public {}
    function pickRandomWinner() {}

    // -------------------
    //  Getters
    // -------------------
    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }
}
