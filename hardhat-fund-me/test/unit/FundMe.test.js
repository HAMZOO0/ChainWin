const { expect } = require("chai");
const { deployments, ethers, getNamedAccount } = require("hardhat");

describe("FundMe Testing ", async () => {
  let FundMe;
  beforeEach(async () => {
    const { deployer } = await getNamedAccount();
    // Deploy all contracts with the [all] tag
    await deployments.fixture("[all]");
    // Get deployed FundMe contract
    FundMe = await ethers.getContract("FundMe", deployer);
  });

  describe("Constructor", () => {
    it();
  });
});
