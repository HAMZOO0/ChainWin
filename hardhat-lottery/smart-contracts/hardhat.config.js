// require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("hardhat-deploy");
require("@nomiclabs/hardhat-ethers");
// require("hardhat-deploy-ethers");
require("@nomicfoundation/hardhat-verify");
require("solidity-coverage");
require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
   defaultNetwork: "hardhat",

   networks: {
      sepolia: {
         url: process.env.INFURA_URL,
         accounts: [process.env.SEPOLIA_NETWORK_PRIVATE_KEY],
         blockConfirmation: 6,
      },

      localhost: {
         url: "http://127.0.0.1:8545/",
         //account : done by hardhat already
         chainid: 31337,
      },
   },

   // solidity: "0.8.28",
   solidity: {
      compilers: [{ version: "0.8.0" }, { version: "0.8.28" }],
      // paths: {
      //    sources: "./abc", // <-- your current folder
      // },
   },
   etherscan: {
      apiKey: process.env.ETHERSCAN_API_KEY,
   },

   namedAccounts: {
      deployer: {
         default: 0,
      },
      player: {
         default: 1,
      },
   },

   gasReporter: {
      enabled: true,
      currency: "USD",
      coinmarketcap: process.env.COINMARKETCAP_API_KEY,
      token: "ETH",
      // offline: true,
      gasPrice: 0.000029218760090611, // ← simulate realistic price (in Gwei)
      // showTimeSpent: true,
      // noColors: true,
      // currencyDisplayPrecision: 8, // ← force display of small USD costs
      // noColors: true,
   },
};
