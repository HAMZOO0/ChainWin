const { network } = require("hardhat");
const {
   developmentChains,
   networkConfig,
} = require("../helper-hardhat-config.js");
const { verify } = require("../utils/verify.js");
require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
   const { log, deploy } = deployments;

   const { deployer } = await getNamedAccounts();

   const Lottery = await deploy("Lottery", {
      from: deployer,
      arg: [],
      log: true,
      waitConfirmations: network.config.blockConfirmation || 1,
   });
};
module.exports.tags = [];
