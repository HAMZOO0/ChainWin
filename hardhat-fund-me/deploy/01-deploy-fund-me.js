//hardhat deploy plugin : github.com/wighawag/hardhat-deploy?tab=readme-ov-file#an-example-of-a-deploy-script-

// what is mocking : mocking is creating objects that simulate the behaviour of real objects.

// get is a helper function provided by the hardhat-deploy plugin.
// It is used to get the deployment info(like address, ABI, etc.) of a contract that was already deployed using hardhat-deploy.

const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify.js");
require("dotenv").config();

// All these arguments are automatically passed by hardhat-deploy hre.getNamedAccount , hre.eployments
module.exports = async ({ getNamedAccounts, deployments }) => {
  console.log(process.env.ETHERSCAN_API_KEY);

  const { deploy, log, get } = deployments;
  // here we get deploter accont  - we mention this in hardhat.config.js also
  const { deployer } = await getNamedAccounts();
  const chainid = network.config.chainId;

  let ethUsdPriceFeedAddress;
  if (developmentChains.includes(network.name)) {
    // Get address of mock contract deployed locally
    const mockContract = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = mockContract.address;
  }
  //  Real Chainlink price feed on Sepolia
  else {
    ethUsdPriceFeedAddress = "0x694AA1769357215DE4FAC081bf1f309aDC325306"; // Sepolia
  }
  const args = [ethUsdPriceFeedAddress];

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethUsdPriceFeedAddress],
    log: true,
  });

  // verify the contract for etherscan , if it is not local network then ...
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    //verify
    await verify(fundMe, args);
  }

  log("----------------------------------------------------");
};

module.exports.tags = ["Sepolia", "all"];
