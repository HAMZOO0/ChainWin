const { network, ethers } = require("hardhat");
const {
   developmentChains,
   networkConfig,
} = require("../helper-hardhat-config.js");
const { verify } = require("../utils/verify.js");
require("dotenv").config();

const BASE_FEE = ethers.utils.parseEther("0.24"); //It's the flat LINK fee for every VRF request. This is charged no matter what.
const GAS_PRICE_LINK = 1e9;
//? Total Fee = (BASE_FEE + GAS_USED × GAS_PRICE_LINK) × (1 + Premium %)

module.exports = async ({ getNamedAccounts, deployments }) => {
   const { log, deploy } = deployments;

   const { deployer } = await getNamedAccounts();

   if (developmentChains.includes(network.name)) {
      log(`${network.name} Local Network Detected So We Use Mock Contract`);

      // deploying a MockV3Aggregator
      const MockV3Aggregator = await deploy("VRFCoordinatorV2Mock", {
         arg: [BASE_FEE, GAS_PRICE_LINK],
         log: true,
         waitConfirmations: network.config.blockConfirmation || 1,
      });
      log("VRFCoordinatorV2Mock is Deployed !");
      log("----------------------------------------------------");
   }
};

module.exports.tags = ["All", "mock", "local"];

// | Item             | Value                             |
// | ---------------- | --------------------------------- |
// | Base fee         | 0.1 LINK                          |
// | Gas used × price | 0.0002 LINK                       |
// | Subtotal         | 0.1002 LINK                       |
// | Premium 20%      | `0.1002 × 0.20 = 0.02004`         |
// |  Final Fee      | `0.1002 + 0.02004 = 0.12024 LINK` |
