// function deployFun() {
//     console.log("kasy ho");

const { network } = require("hardhat");
const { from } = require("memorystream");
const ethUsdPriceFeedAddress = "0x694AA1769357215DE4FAC081bf1f309aDC325306"; // Sepolia

// }

// module.exports = deployFun;
//github.com/wighawag/hardhat-deploy?tab=readme-ov-file#an-example-of-a-deploy-script-
https: rrequire("dotenv").config();

//* All these arguments are automatically passed by hardhat-deploy hre.getNamedAccount , hre.eployments
module.exports = async ({ getNamedAccount, deployments }) => {
  console.log(process.env.ETHERSCAN_API_KEY);

  const { deploy, log } = deployments;
  const { deloyer } = getNamedAccount(); // here we get deploter accont  - we mention this in hardhat.config.js also
  const chainid = network.config.chainId;

  const fundme = await deploy("Fundme", {
    from: deloyer,
    args: [ethUsdPriceFeedAddress],
    log: true,
  });
};
