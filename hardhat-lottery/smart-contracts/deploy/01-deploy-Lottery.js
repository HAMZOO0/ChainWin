const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config.js");
const { verify } = require("../utils/verify.js");
require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {

   const { log, deploy } = deployments;

   const { deployer } = await getNamedAccounts();

   const Lottery = await deploy("Lottery", {
      from: deployer,
      arg: [],
      log: true,
      waitConfirmations: 1,
   });
}
module.exports.tags = [];
