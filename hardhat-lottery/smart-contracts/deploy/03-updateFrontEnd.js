const { deployments, getNamedAccounts, ethers, network } = require("hardhat");
const fs = require("fs");
const path = require("path"); // ✅ you missed this

const FRONT_END_ADDRESS_FILE = path.resolve(__dirname, "../../frontend/src/constants/contractAddress.json");
const FRONT_END_ABI_FILE = path.resolve(__dirname, "../../frontend/src/constants/abi.json");

module.exports = async () => {
   // if we are updating frontend
   if (process.env.UPDATING_FRONT_END) {
      console.log(" Updating Frontend Contract");
      await UpdatingContractAddresses();
      await UpdatingContractABI();
   }
};

async function UpdatingContractAddresses() {
   // get the address of contract
   const Lottery = await deployments.get("Lottery");

   // get older address
   const currentAddresses = JSON.parse(fs.readFileSync(FRONT_END_ADDRESS_FILE, "utf-8"));

   const chainId = await network.config.chainId.toString();

   // If we already have this chainId in the file
   if (currentAddresses[chainId]) {
      // And if the address is not already in the list
      if (!currentAddresses[chainId].includes(Lottery.address)) {
         currentAddresses[chainId].push(Lottery.address); // Add it
      }
   } else {
      // If it's a new chainId, create a new list with the address
      currentAddresses[chainId] = [Lottery.address];
   }
   fs.writeFileSync(FRONT_END_ADDRESS_FILE, JSON.stringify(currentAddresses));
   console.log("✅ Address Updated");
}

async function UpdatingContractABI() {
   const Lottery = await deployments.get("Lottery");
   const contract = await ethers.getContractAt("Lottery", Lottery.address);
   fs.writeFileSync(FRONT_END_ABI_FILE, contract.interface.format(ethers.utils.FormatTypes.json));
   console.log("✅ ABI Updated");
}

module.exports.tags = ["All", "frontend"];
