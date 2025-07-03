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
