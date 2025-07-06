const { network, ethers } = require("hardhat");
const {
   developmentChains,
   networkConfig,
} = require("../helper-hardhat-config.js");
const { verify } = require("../utils/verify.js");
require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
   let vrfCoordinator, subscriptionId; // address  , id
   const networkName = network.name;
   const { log, deploy, get } = deployments;

   const { deployer } = await getNamedAccounts();

   if (developmentChains.includes(network.name)) {
      //Mock
      const vrfCoordinatorMock = await get("VRFCoordinatorV2Mock");
      vrfCoordinator = vrfCoordinatorMock.address;

      //Create Subscription Automatically
      const tx = await vrfCoordinatorMock.createSubscription();
      const txRecipt = await tx.wait(1);
      subscriptionId = txRecipt.event[0].arg.subId;

      //Fund it with LINK (Mock uses ETH)
      await vrfCoordinatorMock.fundSubscription(
         subscriptionId,
         ethers.utils.parseEther("10")
      );
   } else {
      // address setup
      vrfCoordinator = networkConfig[networkName].vrfCoordinator;
      console.log("vrfCoordinator = networkConfig['sepolia']", vrfCoordinator);

      // subscription
      subscriptionId = networkConfig[networkName].subscriptionId;
   }

   const entranceFee = networkConfig[networkName].entranceFee;
   const keyHash = networkConfig[networkName].keyHash;
   const gasLimit = networkConfig[networkName].callbackGasLimit;
   const arg = [vrfCoordinator, entranceFee, keyHash, subscriptionId, gasLimit];
   const Lottery = await deploy("Lottery", {
      from: deployer,
      args: arg,
      log: true,
      waitConfirmations: network.config.blockConfirmation || 1,
   });
};
module.exports.tags = [];
