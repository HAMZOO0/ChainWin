const { ethers } = require("hardhat");

const networkConfig = {
   sepolia: {
      vrfCoordinator: "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B",
      entranceFee: ethers.utils.parseEther("0.01"),

      subscriptionId: "",
      keyHash:
         "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae",
   },
   hardhat: {
      // vrfCoordinator: "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B",
      entranceFee: ethers.utils.parseEther("0.01"),
      subscriptionId: "",
      keyHash:
         "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae",
   },
   localhost: {
      // vrfCoordinator: "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B",
      entranceFee: ethers.utils.parseEther("0.01"),
      subscriptionId: "",
      keyHash:
         "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae",
    },
};

const developmentChains = ["hardhat", "localhost"];

module.exports = {
   developmentChains,
   networkConfig,
};
