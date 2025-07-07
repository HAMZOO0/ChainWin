import hardhat from "hardhat";
const { deployments, ethers, getNamedAccounts, network } = hardhat;
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { developmentChains } from "../../helper-hardhat-config.js";
import "@nomicfoundation/hardhat-chai-matchers";

chai.use(chaiAsPromised);
const { expect } = chai;

!developmentChains.includes(network.name)
   ? describe.skip
   : describe("Lottery Testing ...", () => {
        let Lottery, VRFCoordinatorV2Mock, signer;
        const sendValue = ethers.utils.parseEther("0.1"); // 1 ETH

        beforeEach(async () => {
           // get signer
           const { deploy } = await getNamedAccounts();
           signer = await ethers.getSigner(deploy);

           // deploy
           await deployments.fixture(["All"]);

           //get contract
           Lottery = await deployments.get("Lottery");
           Lottery = await ethers.getContractAt(
              "Lottery",
              Lottery.address,
              signer
           );

           VRFCoordinatorV2Mock = await deployments.get("VRFCoordinatorV2Mock");
           VRFCoordinatorV2Mock = await ethers.getContractAt(
              "VRFCoordinatorV2Mock",
              VRFCoordinatorV2Mock.address,
              signer
           );

           //   console.log("VRFCoordinatorV2Mock :: ", Lottery);
           //   console.log("Lottery :: ", VRFCoordinatorV2Mock);
        });

        describe("Constructor", () => {
           it("should have open Lottery state ", async () => {
              const state = await Lottery.getLotteryState();
              expect(state.toString()).to.equal("0");
           });
        });
        describe("Lottery Ticket purchase ", () => {
           it("Should fail if not enough ETH is sent", async () => {
              await expect(Lottery.buyTicket()).to.be.rejected;
           });

           it("Should record when player buy the ticket ", async () => {
              // 1 : we need to but ticket
              await Lottery.buyTicket({ value: sendValue });
              const buyer = await Lottery.getPlayers(0);

              expect(buyer).to.equal(signer.address);
           });

           it("Should emit event when we but the ticket", async () => {
              expect(await Lottery.buyTicket({ value: sendValue })).to.emit(
                 Lottery,
                 "TicketBought"
              );
           });
           it("Should emit event when we but the ticket", async () => {
              expect(await Lottery.buyTicket({ value: sendValue })).to.emit(
                 Lottery,
                 "TicketBought"
              );
           });

           it("if lottry state is close then player can't purchase the ticket", async () => {
              //   await network.provider.send("evm_increaseTime", [
              //      interval.toNumber() + 1,
              //   ]);
              //   await network.provider.request({
              //      method: "evm_mine",
              //      params: [],
              //   });

              await Lottery.test_setStateToCalculating(); // change the state manually
              await expect(Lottery.buyTicket({ value: sendValue })).to.be
                 .rejected;
           });
        });
        describe("checkUpkeep", () => {
           it("checkUpkeep will have all conditions true", async () => {
              //bool isTime = (block.timestamp - s_lastTimeStamp) > i_interval; to make this condition true we need to pass  31s to store new time stamp
              await network.provider.send("evm_increaseTime", [31]);
              await network.provider.request({
                 method: "evm_mine",
                 params: [],
              });
              const { upkeepNeeded } = await Lottery.callStatic.checkUpkeep([]);
              expect(upkeepNeeded);
           });
        });
     });
