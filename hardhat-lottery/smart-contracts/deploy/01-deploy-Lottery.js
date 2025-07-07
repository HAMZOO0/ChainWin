const { network, ethers } = require("hardhat");
const {
   developmentChains,
   networkConfig,
} = require("../helper-hardhat-config.js");
const { verify } = require("../utils/verify.util.js");
require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
   let vrfCoordinator, subscriptionId; // address  , id
   const networkName = network.name;
   const { log, deploy, get } = deployments;

   const { deployer } = await getNamedAccounts();

   if (developmentChains.includes(network.name)) {
      //Mock
      const vrfCoordinatorDeployment = await get("VRFCoordinatorV2Mock");
      const vrfCoordinatorMock = await ethers.getContractAt(
         "VRFCoordinatorV2Mock",
         vrfCoordinatorDeployment.address
      );

      vrfCoordinator = vrfCoordinatorMock.address;

      //Create Subscription Automatically
      const tx = await vrfCoordinatorMock.createSubscription();
      const txRecipt = await tx.wait(1);
      subscriptionId = txRecipt.events[0].args.subId;
      // subscriptionId = txRecipt.events[0].args.subId.toNumber();
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
   // console.log("Deploying with keyHash:", keyHash);
   const gasLimit = networkConfig[networkName].callbackGasLimit;
   const arg = [vrfCoordinator, entranceFee, subscriptionId, keyHash, gasLimit];
   const Lottery = await deploy("Lottery", {
      from: deployer,
      args: arg,
      log: true,
      waitConfirmations: network.config.blockConfirmation || 1,
   });

   // Verify
   if (
      !developmentChains.includes(network.name) &&
      process.env.ETHERSCAN_API_KEY
   ) {
      log("Verifying .....");

      await verify(Lottery.address, arg);
      log("Verification Done ");
   }
   log("------------------------------------------");
};
module.exports.tags = ["Sepolia", "All"];
