const { ethers, getNamedAccounts } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const balance = await ethers.provider.getBalance(deployer);

  console.log("Deployer address:", deployer);
  console.log("Balance in ETH:", ethers.utils.formatEther(balance));
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
