const { network } = require("hardhat");
const {
   developmentChains,
   networkConfig,
} = require("../helper-hardhat-config.js");
const { verify } = require("../utils/verify.js");
require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
   let vrfCoordinator; // address
   const networkName = network.name;
   const { log, deploy, get } = deployments;

   const { deployer } = await getNamedAccounts();

   if (developmentChains.includes(network.name)) {
      const vrfCoordinatorMock = await get("VRFCoordinatorV2Mock");
      vrfCoordinator = vrfCoordinatorMock.address;
   } else {
      vrfCoordinator = networkConfig[networkName].vrfCoordinator;
      console.log("vrfCoordinator = networkConfig['sepolia']", vrfCoordinator);
   }

   const entranceFee = networkConfig[networkName].entranceFee;
   const keyHash = networkConfig[networkName].gasHash;
   const arg = [vrfCoordinator, entranceFee, keyHash];
   const Lottery = await deploy("Lottery", {
      from: deployer,
      arg: [],
      log: true,
      waitConfirmations: network.config.blockConfirmation || 1,
   });
};
module.exports.tags = [];
