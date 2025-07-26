### What is Chainlink VRF?
- **Chainlink VRF** = Verifiable Random Function  
   - This is like your Chainlink account ID for randomness.
   - Solidity can't generate true random numbers (all nodes must run the same logic).
   - Chainlink VRF provides secure, verifiable randomness from outside the blockchain.

---

#### Key Concepts

- **subscriptionId**
   - Your Chainlink account ID for randomness.
   - Steps to get it:
      - Go to [Chainlink VRF dashboard](https://vrf.chain.link)
      - Connect your wallet
      - Create a new subscription
      - Copy the generated subscriptionId (e.g., 1234)

- **vrfCoordinator**
   - The address of Chainlink's service contract on the blockchain.
   - Your contract sends randomness requests here.
   - Chainlink nodes listen to this contract and respond with random numbers.

- **keyHash**
   - Specifies which Chainlink configuration (lane) to use for randomness.
   - Different keyHashes can have different speeds and costs.
      - Example:
         - lane_1 (keyHash A): Normal, Cheap
         - lane_2 (keyHash B): Fast, Medium
         - lane_3 (keyHash C): Super Fast, Expensive

---

#### Analogy

- Think of Chainlink as a Random Number Generator Shop 🎰
   - **vrfCoordinator** = Shop address
   - **subscriptionId** = Your membership ID
   - **keyHash** = Which counter/lane to use (speed/cost)

---

- Your contract calls `requestRandomWords()` → talks to `vrfCoordinator`
- Chainlink nodes pick up the request and return a random number
- Without `vrfCoordinator`, your contract can't connect to Chainlink

---

1️⃣ requestRandomWords() – You ask Chainlink for a random number
This function is inside your contract:

```
s_requestId = s_vrfCoordinator.requestRandomWords(
    VRFV2PlusClient.RandomWordsRequest({
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
```
👇 What happens when you call this?
Your contract sends a request to the Chainlink VRF Coordinator (the Chainlink service contract).

Chainlink nodes see your request.

They start generating a secure random number off-chain.

---

2️⃣ fulfillRandomWords() – Chainlink gives your contract the random number
Chainlink will now call this function in your contract automatically:

```
function fulfillRandomWords(
    uint256 requestId,
    uint256[] calldata randomWords
) internal override {
    // You get the random number here
    uint256 winnerIndex = randomWords[0] % s_players.length;
    address payable winner = s_players[winnerIndex];
    s_recentWinner = winner;

    (bool success, ) = winner.call{value: address(this).balance}("");
    require(success, "Transfer failed");
}

```

👇 What happens inside this?
randomWords[0]: This is the random number sent by Chainlink

You use it to find a winner (e.g. pick a player from the list)

Then send all contract balance (lottery money) to that winner