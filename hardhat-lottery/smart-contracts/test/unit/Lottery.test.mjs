import hardhat from "hardhat";
const { deployments, ethers, getNamedAccounts, network } = hardhat;
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { developmentChains } from "../../helper-hardhat-config.js";

chai.use(chaiAsPromised);
const { expect } = chai;

!developmentChains.includes(network.name)
   ? describe.skip
   : describe("Lottery Testing ...", () => {
        let Lottery, VRFCoordinatorV2Mock, signer;
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
     });
