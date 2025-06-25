const { expect } = require("chai");

const { deployments, ethers, getNamedAccounts } = require("hardhat");

describe("FundMe Testing ", async () => {
  let FundMe, MockV3Aggregator;
  beforeEach(async () => {
    const { deployer } = await getNamedAccounts();
    const signer = await ethers.getSigner(deployer);

    // Deploy all contracts with the [all] tag
    await deployments.fixture(["all"]);
    //gets the contract’s address and ABI from Hardhat Deploy (just tells you where the contract is and what it can do, like a blueprint).
    FundMe = await deployments.get("FundMe");

    //connects that contract (address + ABI) to a signer (wallet) so that you can call functions on it , like .fund(), .withdraw(), etc.
    FundMe = await ethers.getContractAt("FundMe", FundMe.address, signer);
    // console.log("FundMe---------", FundMe);

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

  describe("fund funcion", () => {
    it("Should fail if not enough money should receive", async () => {
      // await expect(FundMe.Fund).to.be.revertedWith("Send more Eth");
    });
  });
});
