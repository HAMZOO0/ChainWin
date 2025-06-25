const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { Contract } = require("ethers");

const decimal = 8;
const initalAnswer = 500000000;

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts(); // here we get deploter accont  - we mention this in hardhat.config.js also

  if (developmentChains.includes(network.name)) {
    log("Local network found! Deploying mocks ...");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [decimal, initalAnswer],
    });
    log("mock deployed !");
    log("----------------------------------------------------");
  }
};

module.exports.tags = ["local", "mocks","all"];
