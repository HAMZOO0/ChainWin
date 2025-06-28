const { ethers, getNamedAccounts } = require("hardhat");

async function main() {
  let { deployer } = await getNamedAccounts();

  deployer = await getNamedAccounts().deployer;
  const signer = await ethers.getSigner(deployer);

  FundMe = await deployments.get("FundMe");
  FundMe = await ethers.getContractAt("FundMe", FundMe.address, deployer);

  const transactionResponce = await FundMe.withdraw();
  const transactionRecipt = await transactionResponce.wait(1);
  console.log("transactionRecipt :: ", transactionRecipt);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
