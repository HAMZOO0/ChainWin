import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, address } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const WithdrawButton = document.getElementById("WithdrawButton");
const sendValue = ethers.utils.parseEther("5"); // 1 ETH

connectButton.onclick = connect;
fundButton.onclick = fund;
WithdrawButton.onclick = withdraw;

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
   //  console.log(`Fund ammount is ${ammount}`);
   //provider  - connection with blockchain
   //signer - wallet  - someone with some gas
   // contract - that we are interating with
   const provider = new ethers.providers.Web3Provider(window.ethereum);
   const signer = provider.getSigner();
   //  console.log("signer :: ", signer);
   const contract = new ethers.Contract(address, abi, signer);
   try {
      const txResponse = await contract.Fund({ value: sendValue });
      await txResponse.wait();
      console.log("Funded ✅");
   } catch (err) {
      console.error("❌ Error funding:", err);
   }
}
async function withdraw(ammount) {}
