const { task } = require("hardhat/config");
require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
})
const privateKeySepolia = process.env.SEPOLIA_PRIVATE_KEY;
const privateKeyLocalhost = process.env.LOCALHOST_PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [privateKeySepolia]
    }
  }
};

