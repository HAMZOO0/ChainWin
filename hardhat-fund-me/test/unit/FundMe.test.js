const { expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");

describe("FundMe Testing ", async () => {
  let FundMe, MockV3Aggregator;
  beforeEach(async () => {
    const { deployer } = await getNamedAccounts();
    const signer = await ethers.getSigner(deployer);

    // Deploy all contracts with the [all] tag
    await deployments.fixture(["all"]);

    FundMe = await deployments.get("FundMe");
    FundMe = await ethers.getContractAt("FundMe", FundMe.address, signer);

    MockV3Aggregator = await deployments.get("MockV3Aggregator");
    MockV3Aggregator = await ethers.getContractAt(
      "MockV3Aggregator",
      MockV3Aggregator.address,
      signer
    );
    // console.log("getNamedAccounts", await getNamedAccounts());

    // console.log("deployer", deployer);
    // console.log("signer", signer);

    // console.log("MockV3Aggregator.address", MockV3Aggregator.address);
    // console.log(" FundMe.priceFeed()", await FundMe.priceFeed());
  });

  describe("Constructor", () => {
    it("Should have currect MockV3Aggregator contract address ", async () => {
      expect(MockV3Aggregator.address).to.equal(await FundMe.priceFeed());
    });
  });
});
