const { deployments, ethers, getNamedAccounts, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const chai = require("chai");
const { expect } = chai;

developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", () => {
      let FundMe;
      let deployer, signer;
      const sendValue = ethers.utils.parseEther("0.01"); // 1 ETH
      beforeEach(async () => {
        deployer = await getNamedAccounts().deployer;
        signer = await ethers.getSigner(deployer);

        FundMe = await deployments.get("FundMe");
        FundMe = await ethers.getContractAt("FundMe", FundMe.address, deployer);

        // chain link price of eth/use
        // const price = await FundMe.getPrice();
        // console.log("Current ETH Price from Chainlink:", price.toString());

        const endingDeployerBalance = await ethers.provider.getBalance(
          signer.address
        );
        console.log(
          "endingDeployerBalance",
          ethers.utils.formatEther(endingDeployerBalance)
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
