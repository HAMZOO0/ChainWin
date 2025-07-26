import hardhat from "hardhat";
const { deployments, ethers, getNamedAccounts, network } = hardhat;

async function enterRaffle() {
   const { deployer } = await getNamedAccounts();
   console.log("deployer :: ", deployer);

   const signer = await ethers.getSigner(deployer);
   console.log("⛓️ Fetching deployed contract...");
   const deployment = await deployments.get("Lottery");
   const Lottery = await ethers.getContractAt("Lottery", deployment.address, signer);
   const entranceFee = await Lottery.getEntranceFee(); // 0.0001 eth

   console.log("💸 Fetching entrance fee...");
   console.log(`💰 Entrance Fee: ${ethers.utils.formatEther(entranceFee)} ETH`);

   console.log("🎯 Entering the lottery ...");
   const tx = await Lottery.buyTicket({ value: entranceFee });
   await tx.wait(1);

   const winner = await Lottery.getRecentWinner();
   console.log("wiiner !", winner);
   console.log("🎉 Entered lottery Successfully!");
}

enterRaffle()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error("❌ Error:", error);
      process.exit(1);
   });
