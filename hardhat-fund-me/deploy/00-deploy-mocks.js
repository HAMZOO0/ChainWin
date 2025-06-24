const { network } = require("hardhat");

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
