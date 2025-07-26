const { network, ethers } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat-config.js");
const { verify } = require("../utils/verify.util.js");
require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
   let vrfCoordinatorAddress, subscriptionId; // address  , id
   const networkName = network.name;
   const { log, deploy, get } = deployments;

   const { deployer } = await getNamedAccounts();
   console.log("deployer", deployer);

   if (developmentChains.includes(network.name)) {
      //Mock
      const vrfCoordinatorDeployment = await get("VRFCoordinatorV2_5Mock");
      const vrfCoordinatorMock = await ethers.getContractAt("VRFCoordinatorV2_5Mock", vrfCoordinatorDeployment.address);

      // setting vrfCoordinator - constructor argument
      vrfCoordinatorAddress = vrfCoordinatorMock.address;

      //Create Subscription Automatically
      const tx = await vrfCoordinatorMock.createSubscription();
      const txRecipt = await tx.wait(1);
      subscriptionId = txRecipt.events[0].args.subId;

      //Fund it with LINK (Mock uses ETH)
      await vrfCoordinatorMock.fundSubscription(subscriptionId, ethers.utils.parseEther("10"));

      //Fund it with LINK (Mock uses ETH)
      await vrfCoordinatorMock.fundSubscription(subscriptionId, ethers.utils.parseEther("10"));

      // Add Lottery contract as consumer to the subscription
   } else {
      // address setup
      vrfCoordinatorAddress = networkConfig[networkName].vrfCoordinator;
      console.log("vrfCoordinator = networkConfig['sepolia']", vrfCoordinatorAddress);

      // subscription
      subscriptionId = networkConfig[networkName].subscriptionId;
   }

   const entranceFee = networkConfig[networkName].entranceFee;
   const keyHash = networkConfig[networkName].keyHash;
   // console.log("Deploying with keyHash:", keyHash);
   const gasLimit = networkConfig[networkName].callbackGasLimit;
   const arg = [vrfCoordinatorAddress, entranceFee, subscriptionId, keyHash, gasLimit];
   const Lottery = await deploy("Lottery", {
      from: deployer,
      args: arg,
      log: true,
      waitConfirmations: network.config.blockConfirmation || 1,
   });

   // Verify
   if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
      log("Verifying .....");

      await verify(Lottery.address, arg);
      log("Verification Done ");
   }

   if (developmentChains.includes(network.name)) {
      const vrfCoordinatorMock = await ethers.getContractAt("VRFCoordinatorV2_5Mock", vrfCoordinatorAddress);

      //Hey Chainlink (or our mock), let this contract (Lottery) use the subscription | means Lottery is the user or consumer
      await vrfCoordinatorMock.addConsumer(subscriptionId, Lottery.address);
   }

   log("------------------------------------------");
};
module.exports.tags = ["Sepolia", "All"];
