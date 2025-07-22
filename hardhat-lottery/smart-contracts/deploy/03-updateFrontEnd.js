const { deployments, getNamedAccounts, ethers } = require("hardhat");
const fs = require("fs");
module.export = async () => {
   const FRONT_END_ADDRESS_FILE = "../../frontend/src/constants/contractAddress.json";
   const FRONT_END_ABI_FILE = "../../frontend/src/constants/abi.json";

   // if we are updating frontend
   if (process.env.UPDATING_FRONT_END) {
      console.log(" Updating Frontend Contract");
      await UpdatingContractAddresses();
   }
};

async function UpdatingContractAddresses() {
   // get the address of contract
   const vrfCoordinatorDeployment = await deployments.get("Lottery");

   // get older address
   const oldContractAddress = JSON.parse(fs.readFileSync(FRONT_END_ADDRESS_FILE));
   const oldAbi = JSON.parse(fs.readFileSync(FRONT_END_ABI_FILE, "utf-8"));
}
