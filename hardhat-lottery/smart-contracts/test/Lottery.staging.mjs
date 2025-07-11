// 1 : Get subid for ChainLink VRF and Fund
// 2 : Deploy our contract using subid
// 3 : Register the contract with ChainLink Vrf & it's subid
// 4 : Register the contract with Chainlink Keepers
// 5 : Run the Staging Tests

import hardhat from "hardhat";
const { deployments, ethers, getNamedAccounts, network } = hardhat;
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { developmentChains, networkConfig } from "../helper-hardhat-config.js";
import "@nomicfoundation/hardhat-chai-matchers";

chai.use(chaiAsPromised);
const { expect } = chai;

developmentChains.includes(network.name)
   ? describe.skip
   : describe("Lottery Staging test", function () {
        this.timeout(300000); // wait 5 min for Keepers + VRF

        let signer, Lottery, entranceFee;

        beforeEach(async () => {
           const { deployer } = await getNamedAccounts();
           signer = await ethers.getSigner(deployer);
           const deployment = await deployments.get("Lottery");
           Lottery = await ethers.getContractAt("Lottery", deployment.address, signer);
           entranceFee = await Lottery.getEntranceFee();

           // Reset the state before each test
           const tx = await Lottery.test_resetState();
           await tx.wait(1);

           const state = await Lottery.getLotteryState();
           console.log("Lottery State:", state.toString()); // should be 0 (OPEN)
        });

        describe("fulfillRandomWords", () => {
           it("works with live Chainlink Keepers and VRF", async function () {
              const winnerPickedPromise = new Promise((resolve, reject) => {
                 const timeout = setTimeout(() => {
                    reject(new Error("Timeout waiting for WinnerPicked event"));
                 }, 300000); // 5 minutes

                 Lottery.on("WinnerPicked", async () => {
                    clearTimeout(timeout);
                    try {
                       console.log("🎉 WinnerPicked event fired!");

                       const recentWinner = await Lottery.getRecentWinner();
                       const lotteryState = await Lottery.getLotteryState();
                       const endingTimeStamp = await Lottery.getLastestTimeStamp();
                       const numPlayers = await Lottery.getNumberOfPlayers();
                       const winnerBalance = await ethers.provider.getBalance(recentWinner);

                       console.log("winner :: ", recentWinner);
                       console.log("winner balance:: ", ethers.utils.formatEther(winnerBalance));

                       expect(lotteryState.toString()).to.equal("0"); // OPEN state
                       expect(numPlayers.toString()).to.equal("0");
                       expect(endingTimeStamp).to.be.gt(startingTimeStamp);
                       resolve();
                    } catch (error) {
                       reject(error);
                    }
                 });
              });

              try {
                 const tx = await Lottery.buyTicket({ value: entranceFee });
                 await tx.wait(1);
              } catch (error) {
                 console.error("Error buying ticket:", error);
                 throw error;
              }

              await winnerPickedPromise;
           });
        });
     });
