const { ethers, deployments } = require("hardhat");

async function main() {
   console.log("Querying the deployed Lottery contract for its entrance fee...");
   const deployment = await deployments.get("Lottery");
   const lottery = await ethers.getContractAt("Lottery", deployment.address);
  //  const entranceFee = await lottery.getEntranceFee();
  //  console.log(`The entrance fee is: ${ethers.utils.formatEther(entranceFee)} ETH`);
  //  console.log(`The entrance fee in wei is: ${entranceFee.toString()}`);
   console.log("State ::", await lottery.getLotteryState());
}

main()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error);
      process.exit(1);
   });
