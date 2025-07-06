const { deployments, ethers, getNamedAccounts, network } = require("hardhat");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised); // use async func inside the expect
const { expect } = chai;
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
   ? describe.skip
   : describe("FundMe Testing ", async () => {
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
           FundMe = await ethers.getContractAt(
              "FundMe",
              FundMe.address,
              signer
           );
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
              expect(MockV3Aggregator.address).to.equal(
                 await FundMe.getsPriceFeed()
              );
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
              const res = await FundMe.getsFundersWithAmount(signer.address); // we access the value of this address(key)
              // console.log("res : ", res);
              // console.log("sendValue : ", sendValue);

              expect(res.toString()).to.equal(sendValue.toString());
           });
           it("Shoud have same sender address who send the Eth in list", async () => {
              await FundMe.Fund({ value: sendValue }); // fund first - bcz  in test hardhat reset the state

              const lastAddress = await FundMe.getFunders(0);
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
              //! Arrange
              // const balance = await FundMe.provider.getBalance(FundMe.address);
              const startingContractBalance = await ethers.provider.getBalance(
                 FundMe.address
              ); // balance of this contract
              const startingDeployerBalance = await ethers.provider.getBalance(
                 signer.address
              ); // balance of this user
              // console.log(
              //   "Contract Balance:",
              //   ethers.utils.formatEther(startingContractBalance),
              //   "ETH"
              // );
              // console.log(
              //   "deployer Balance:",
              //   ethers.utils.formatEther(startingDeployerBalance),
              //   "ETH"
              // );

              //! Act
              const transectionResponse = await FundMe.withdraw(); // transection happend - basic detials
              const transectionRecipt = await transectionResponse.wait(1); //wait until this transaction is confirmed and give me full details.
              const { gasUsed, effectiveGasPrice } = transectionRecipt;
              const gasCost = gasUsed.mul(effectiveGasPrice);
              // console.log("gas cost :: ", gasCost);

              // console.log("transectionResponse :: ", transectionResponse);
              // console.log("transectionRecipt :: ", transectionRecipt);

              // after withdraw
              const endingContractBalance = await ethers.provider.getBalance(
                 FundMe.address
              );
              const endingDeployerBalance = await ethers.provider.getBalance(
                 signer.address
              );
              // console.log("endingContractBalance : ", endingContractBalance);
              // console.log("endingDeployerBalance : ", endingDeployerBalance);

              //! Assert

              // 1 : check that contract have zero balance bcz we transfer all eth to owner
              expect(endingContractBalance.toString()).to.equal("0");

              // 2: check that starting + owner = total
              expect(
                 startingContractBalance.add(startingDeployerBalance).toString()
              ).to.equal(endingDeployerBalance.add(gasCost).toString());
           });

           it("Should allow us to withdraw mutiple funders", async () => {
              // Arrange
              const accounts = await ethers.getSigners();
              for (let index = 1; index < accounts.length; index++) {
                 const getConnected = FundMe.connect(accounts[index]);
                 await getConnected.Fund({ value: sendValue });
              }
              const startingContractBalance = await ethers.provider.getBalance(
                 FundMe.address
              ); // balance of this contract
              const startingDeployerBalance = await ethers.provider.getBalance(
                 signer.address
              );

              console.log(
                 "Contract Balance:",
                 ethers.utils.formatEther(startingContractBalance),
                 "ETH"
              );
              console.log(
                 "deployer Balance:",
                 ethers.utils.formatEther(startingDeployerBalance),
                 "ETH"
              );

              //ACT
              const transectionResponse = await FundMe.withdraw();
              const transectionRecipt = await transectionResponse.wait(1);
              const { gasUsed, effectiveGasPrice } = transectionRecipt;
              const gasCost = gasUsed.mul(effectiveGasPrice);

              const endingContractBalance = await ethers.provider.getBalance(
                 FundMe.address
              );
              const endingDeployerBalance = await ethers.provider.getBalance(
                 signer.address
              );

              // Assert
              // 1 : check that contract have zero balance bcz we transfer all eth to owner
              expect(endingContractBalance.toString()).to.equal("0");

              // 2: check that starting + owner = total
              expect(
                 startingContractBalance.add(startingDeployerBalance).toString()
              ).to.equal(endingDeployerBalance.add(gasCost).toString());

              // check  fundersWithAmount is empty or not
              for (let index = 1; index < 20; index++) {
                 expect(
                    (
                       await FundMe.getsFundersWithAmount(
                          accounts[index].address
                       )
                    ).toString()
                 ).to.equal("0");
              }

              // funders list is empty after withdraw
              const fundersLength = await FundMe.getFundersLength(); // OR FundMe.funders(index)
              expect(fundersLength.toNumber()).to.equal(0);
           });

           it("Should allow only owner to withdraw ", async () => {
              const accounts = await ethers.getSigners();
              const attacker = accounts[1]; // this is not owner
              const attackerConnected = await FundMe.connect(attacker);

              await expect(attackerConnected.withdraw()).to.be.rejected;
           });

           it("cheaperWithdraw testing ...", async () => {
              //! Arrange

              const startingContractBalance = await ethers.provider.getBalance(
                 FundMe.address
              );
              const startingDeployerBalance = await ethers.provider.getBalance(
                 signer.address
              );

              //! Act
              const transectionResponse = await FundMe.cheaperWithdraw();
              const transectionRecipt = await transectionResponse.wait(1);
              const { gasUsed, effectiveGasPrice } = transectionRecipt;
              const gasCost = gasUsed.mul(effectiveGasPrice);

              const endingContractBalance = await ethers.provider.getBalance(
                 FundMe.address
              );
              const endingDeployerBalance = await ethers.provider.getBalance(
                 signer.address
              );

              //! Assert

              expect(endingContractBalance.toString()).to.equal("0");

              expect(
                 startingContractBalance.add(startingDeployerBalance).toString()
              ).to.equal(endingDeployerBalance.add(gasCost).toString());
           });
        });

        describe("Find currect owner ", () => {
           it("should must be same owner who withdraw the balance ", async () => {
              expect(await FundMe.getOwner()).to.equal(signer.address);
           });
        });
     });
