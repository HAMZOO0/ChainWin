//hardhat deploy plugin : github.com/wighawag/hardhat-deploy?tab=readme-ov-file#an-example-of-a-deploy-script-
// what is mocking : mocking is creating objects that simulate the behaviour of real objects.

const { network } = require("hardhat");
require("dotenv").config();
// this is for sepolia not for local host for local host we use mock contract ...
const ethUsdPriceFeedAddress = "0x694AA1769357215DE4FAC081bf1f309aDC325306"; // Sepolia

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
