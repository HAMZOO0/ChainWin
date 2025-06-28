import { ethers } from "etherethers - (5.6).esm.min.js";

async function connect() {
  if (window.ethereum !== "undefined") {
    const account = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
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
async function fund(ammount) {
  console.log(`Fund ammount is ${ammount}`);
}
async function withdraw(ammount) {}
