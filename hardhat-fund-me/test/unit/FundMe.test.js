const chai = require("chai");
const { expect, revertedWith } = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const { deployments, ethers, getNamedAccounts } = require("hardhat");

describe("FundMe Testing ", async () => {
  let FundMe, MockV3Aggregator, signer;
  const sendValue = ethers.utils.parseEther("1"); // 1 ETH

  beforeEach(async () => {
    const { deployer } = await getNamedAccounts();
    signer = await ethers.getSigner(deployer);
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

  describe("fund", () => {
    it("Should fail if not enough money should receive", async () => {
      await expect(FundMe.Fund()).to.be.rejectedWith(
        "ETH value must be greater than or equal to 50 USD" // it have same message which i used in fund()
      );
    });
    it("Should update the fundersWithAmount after adding new transection value ", async () => {
      await FundMe.Fund({ value: sendValue }); // fund function is payable so we use value:  ... to send eth
      const res = await FundMe.fundersWithAmount(signer.address); // we access the value of this address(key)
      // console.log("res : ", res);
      // console.log("sendValue : ", sendValue);

      expect(res.toString()).to.equal(sendValue.toString());
    });
    it("Shoud have same sender address who send the Eth in list", async () => {
      await FundMe.Fund({ value: sendValue }); // fund first - bcz  in test hardhat reset the state

      const lastAddress = await FundMe.funders(0);
      // console.log("lastAddress : ", lastAddress);
      // console.log("signer.address : ", signer.address);

      expect(lastAddress).to.equal(signer.address);
    });
  });

  describe("withdraw", () => {
    beforeEach(async () => {
      await FundMe.Fund({ value: sendValue });
    });
    it("withdraw eth from single funder", async () => {
      // const balance = await FundMe.provider.getBalance(FundMe.address);
      const balance = await ethers.provider.getBalance(FundMe.address);
      console.log(
        "Contract Balance:",
        ethers.utils.formatEther(balance),
        "ETH"
      );
      expect(balance.toString()).to.equal(
        ethers.utils.parseEther("1").toString()
      );
    });
  });
});
