const { deployments, ethers, getNamedAccounts, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const chai = require("chai");
const { expect } = chai;

developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", () => {
      let FundMe;
      let deployer, signer;
      beforeEach(async () => {
        let sendValue = ethers.utils.parseEther("1"); // 1 ETH
        signer = await ethers.getSigner(deployer);

        deployer = await getNamedAccounts().deployer;

        FundMe = await deployments.get("FundMe");
        FundMe = await deployments.getContractAt(
          "FundMe",
          FundMe.address,
          deployer
        );
      });

      it("should allow people to fund and withdraw ", async () => {
        await FundMe.Fund({ value: sendValue });
        await FundMe.withdraw();
        const endingContractBalance = await ethers.provider.getBalance(
          FundMe.address
        );

        expect(endingContractBalance.toString()).to.equal("0");
      });
    });
