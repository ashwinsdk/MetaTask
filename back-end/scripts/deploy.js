const { ethers } = require('hardhat');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

async function main() {
    console.log("Connecting to provider...");
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    console.log("Provider connected!");

    console.log("Creating wallet...");
    const signer = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);
    console.log("Wallet created:", signer.address);

    // **Compile and Load the Contract**
    console.log("Loading contract artifacts...");
    const contractPath = path.resolve(__dirname, '../artifacts/contracts/TaskManager.sol/TaskManager.json');
    const contractJSON = JSON.parse(fs.readFileSync(contractPath, 'utf8'));

    // **Create Contract Factory**
    console.log("Creating contract factory...");
    const TaskManagerFactory = new ethers.ContractFactory(contractJSON.abi, contractJSON.bytecode, signer);

    // **Deploy Contract**
    console.log("Deploying contract...");
    const contract = await TaskManagerFactory.deploy();
    await contract.waitForDeployment(); // Corrected for Ethers.js v6

    console.log("✅ Contract deployed at:", contract.target); // Use `target` instead of `address` in ethers v6
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Deployment failed:", error);
        process.exit(1);
    });
