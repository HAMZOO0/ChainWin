import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, ContractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const ownerButton = document.getElementById("owner");
const fundButton = document.getElementById("fundButton");
const WithdrawButton = document.getElementById("WithdrawButton");
const getBalanceButton = document.getElementById("GetBalance");
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

connectButton.onclick = connect;
fundButton.onclick = fund;
WithdrawButton.onclick = withdraw;
getBalanceButton.onclick = getBalance;
ownerButton.onclick = findContractOwner;

async function connect() {
   if (window.ethereum !== "undefined") {
      const account = await window.ethereum.request({
         method: "eth_requestAccounts",
      });
      // console.log(ethers);

      // connect with metamask
      document.getElementById(
         "connectButton"
      ).innerHTML = `Connected ${account[0]}`;
   } else {
      console.log("Meta-Mask Not Found");
      document.getElementById("connectButton").innerHTML =
         "Please Install MetaMask!";
   }
}
async function fund() {
   //provider  - connection with blockchain
   //signer - wallet  - someone with some gas
   // contract - that we are interating with

   const inputAmount = document.getElementById("ethInput").value;

   if (!inputAmount || isNaN(inputAmount)) {
      alert("Please enter a valid ETH amount");
      return;
   }

   const sendValue = ethers.utils.parseEther(inputAmount.toString()); // 1 ETH

   // const provider = new ethers.providers.Web3Provider(window.ethereum);
   // const signer = provider.getSigner();
   //  console.log("signer :: ", signer);
   const contract = new ethers.Contract(ContractAddress, abi, signer);
   try {
      const txResponse = await contract.Fund({ value: sendValue });
      await txResponse.wait();
      console.log("Funded ✅");
      // const owner = await contract.getOwner();
      // console.log("Owner Address:", owner);
   } catch (err) {
      console.error("❌ Error funding:", err);
   }
}
async function withdraw() {
   // const provider = new ethers.providers.Web3Provider(window.ethereum);
   // const signer = provider.getSigner();
   const contract = new ethers.Contract(ContractAddress, abi, signer);

   try {
      const txResponse = await contract.cheaperWithdraw();
      await txResponse.wait();
      console.log("Withdraw Successful ✅");
   } catch (error) {
      console.error("❌ Withdraw failed:", error);
   }
}

async function getBalance() {
   if (window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(ContractAddress);
      const string_balance = balance.toString();
      console.log(ethers.utils.formatEther(string_balance));
   }
}

async function findContractOwner() {
   const provider = new ethers.providers.Web3Provider(window.ethereum);
   const signer = provider.getSigner();
   const contract = new ethers.Contract(ContractAddress, abi, signer);

   const owner = await contract.getOwner();
   console.log("🔑 Contract Owner:", owner);

   const currentUser = await signer.getAddress();
   console.log("🧑 You (Connected Account):", currentUser);

   if (owner.toLowerCase() === currentUser.toLowerCase()) {
      console.log("✅ You ARE the contract owner");
   } else {
      console.log("❌ You are NOT the contract owner");
   }
}
