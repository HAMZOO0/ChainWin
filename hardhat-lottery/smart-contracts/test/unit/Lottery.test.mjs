import hardhat from "hardhat";
const { deployments, ethers, getNamedAccounts, network } = hardhat;
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import {
   developmentChains,
   networkConfig,
} from "../../helper-hardhat-config.js";
import "@nomicfoundation/hardhat-chai-matchers";

chai.use(chaiAsPromised);
const { expect } = chai;

!developmentChains.includes(network.name)
   ? describe.skip
   : describe("Lottery Testing ...", () => {
        let Lottery, VRFCoordinatorV2_5Mock, signer;
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

           VRFCoordinatorV2_5Mock = await deployments.get(
              "VRFCoordinatorV2_5Mock"
           );
           VRFCoordinatorV2_5Mock = await ethers.getContractAt(
              "VRFCoordinatorV2_5Mock",
              VRFCoordinatorV2_5Mock.address,
              signer
           );
           //   // ✅ Add lottery as a consumer
           //   await VRFCoordinatorV2_5Mock.addConsumer(0, Lottery.address);

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
              await expect(Lottery.buyTicket()).to.be.revertedWithCustomError(
                 Lottery,
                 "Lottery__NotEnoughETHForEntranceFee"
              );
           });

           it("Should record when player buy the ticket ", async () => {
              // 1 : we need to but ticket
              await Lottery.buyTicket({ value: sendValue });
              const buyer = await Lottery.getPlayers(0);

              expect(buyer).to.equal(signer.address);
           });

           it("Should emit event when we but the ticket", async () => {
              await expect(Lottery.buyTicket({ value: sendValue })).to.emit(
                 Lottery,
                 "TicketBought"
              );
           });
           it("Should emit event when we but the ticket", async () => {
              await expect(Lottery.buyTicket({ value: sendValue })).to.emit(
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
              await expect(
                 Lottery.buyTicket({ value: sendValue })
              ).to.be.revertedWithCustomError(Lottery, "Lottery__NotOpen");
           });
        });
        describe("checkUpkeep", () => {
           it("Should return false because balance = 0", async () => {
              //bool isTime = (block.timestamp - s_lastTimeStamp) > i_interval; to make this condition true we need to pass  31s to store new time stamp
              await network.provider.send("evm_increaseTime", [31]);
              await network.provider.request({
                 method: "evm_mine",
                 params: [],
              });
              //callStatic simulate the function don't change or perform any transection
              const { upkeepNeeded } = await Lottery.callStatic.checkUpkeep([]);
              //   console.log("upkeepNeeded :: ", upkeepNeeded);

              expect(!upkeepNeeded);
           });

           it("Should return False if Lottery is Closed State", async () => {
              // send true
              await Lottery.buyTicket({ value: sendValue });
              // time stamp true
              await network.provider.send("evm_increaseTime", [31]);
              await network.provider.request({
                 method: "evm_mine",
                 params: [],
              });

              //set to closed state of lottery
              await Lottery.test_setStateToCalculating();
              // upkeepNeeded returns false
              const { upkeepNeeded } = await Lottery.callStatic.checkUpkeep([]);
              //   console.log("upkeepNeeded :: ", upkeepNeeded);

              expect(!upkeepNeeded);
           });

           it("Should return True After sending Transection", async () => {
              //send true
              await Lottery.buyTicket({ value: sendValue });

              // time stamp true
              await network.provider.send("evm_increaseTime", [31]);
              await network.provider.request({
                 method: "evm_mine",
                 params: [],
              });

              //callStatic simulate the function don't change or perform any transection
              const { upkeepNeeded } = await Lottery.callStatic.checkUpkeep([]);
              console.log("upkeepNeeded :: ", upkeepNeeded);

              expect(upkeepNeeded);
           });
        });
        describe("performUpkeep", () => {
           //* setting the checkUpkeep true to run the performUpkeep function

           it("Should only run when checkUpkeep is true ", async () => {
              await Lottery.buyTicket({ value: sendValue });
              await network.provider.send("evm_increaseTime", [31]);
              await network.provider.request({
                 method: "evm_mine",
                 params: [],
              });

              //callStatic simulate the function don't change or perform any transection
              const { upkeepNeeded } = await Lottery.callStatic.checkUpkeep([]);
              //   console.log("upkeepNeeded :: inthe perfm ke", upkeepNeeded);

              const tx = await Lottery.performUpkeep([]);
              const recipt = await tx.wait();
              //   console.log("tx", tx);

              expect(tx);
           });
           it("Should revert when checkUpkeep is false", async () => {
              // it upkeepNeeded will be false
              //   const { upkeepNeeded } = await Lottery.callStatic.checkUpkeep([]);

              await expect(
                 Lottery.performUpkeep([])
              ).to.be.revertedWithCustomError(
                 Lottery,
                 "Lottery__UpkeepNotNeeded"
              );
              // rejected also works
           });
        });
     });
