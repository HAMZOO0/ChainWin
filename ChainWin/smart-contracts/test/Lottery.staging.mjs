// 1 : Get subid for ChainLink VRF and Fund
// 2 : Deploy our contract using subid
// 3 : Register the contract with ChainLink Vrf & it's subid
// 4 : Register the contract with Chainlink Keepers
// 5 : Run the Staging Tests

//!!! -->  fix all this ai code with ffc and unit test

import hardhat from "hardhat";
const { deployments, ethers, getNamedAccounts, network } = hardhat;
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { developmentChains } from "../helper-hardhat-config.js";
import "@nomicfoundation/hardhat-chai-matchers";

chai.use(chaiAsPromised);
const { expect } = chai;

developmentChains.includes(network.name)
   ? describe.skip
   : describe("Lottery Staging test", function () {
        let signer, Lottery, entranceFee;

        beforeEach(async () => {
           const { deployer } = await getNamedAccounts();
           console.log("deployer :: ", deployer);

           signer = await ethers.getSigner(deployer);
           const deployment = await deployments.get("Lottery");
           Lottery = await ethers.getContractAt("Lottery", deployment.address, signer);
           entranceFee = await Lottery.getEntranceFee(); // 0.0001 eth

           // Reset the state before each test
           //   const tx = await Lottery.test_resetState();
           //   await tx.wait(1);

           const state = await Lottery.getLotteryState();
           console.log("Lottery State:", state.toString()); // should be 0 (OPEN)
        });

        describe("fulfillRandomWords", () => {
           it("works with live Chainlink Keepers and VRF", async function () {
              this.timeout(300000); // wait up to 5 minutes
              console.log("Setting up test...");
              const startingTimeStamp = await Lottery.getLastestTimeStamp();
              const accounts = await ethers.getSigners();

              // Buy ticket
              try {
                 const tx = await Lottery.buyTicket({ value: entranceFee });
                 await tx.wait(1);
                 const winnerStatingBalance = await accounts[0].getBalance();
                 console.log("winnerStatingBalance", await ethers.utils.formatEther(winnerStatingBalance));
              } catch (error)
              {
                 console.error("❌ Error buying ticket:", error);
                 throw error;
              }

              // Wait for the WinnerPicked event
              return new Promise((resolve, reject) => {
                 Lottery.once("WinnerPicked", async () => {
                    try {
                       console.log("🎉 WinnerPicked event fired!");

                       const recentWinner = await Lottery.getRecentWinner();
                       const lotteryState = await Lottery.getLotteryState();
                       const endingTimeStamp = await Lottery.getLastestTimeStamp();
                       const numPlayers = await Lottery.getNumberOfPlayers();
                       const winnerBalance = await ethers.provider.getBalance(recentWinner);

                       console.log("Recent Winner:", recentWinner);
                       console.log("Expected Winner:", accounts[0].address);
                       console.log("Winner Balance:", ethers.utils.formatEther(winnerBalance));

                       expect(recentWinner.toString()).to.equal(accounts[0].address);
                       expect(lotteryState.toString()).to.equal("0"); // Should be open again
                       expect(numPlayers.toString()).to.equal("0");
                       expect(endingTimeStamp).to.be.gt(startingTimeStamp);
                       resolve();
                    } catch (err) {
                       reject(err);
                    }
                 });
              });
           });
        });
     });
