const { ethers } = require('ethers');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const signer = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);

    //const contractAddress = "0x26b01E3AD38E32645f308d11C81575D03f126da9"; // Replace after deployment
    const contractAddress = "0xb93E6A9CA2C59267cBfb484Ac0F24440B19574ca";

    const contractPath = path.resolve(__dirname, '../artifacts/contracts/EM.sol/GrievanceSystem.json');
    const contractJSON = JSON.parse(fs.readFileSync(contractPath, 'utf8'));

    const contract = new ethers.Contract(contractAddress, contractJSON.abi, signer);

    try {
        const balance = await contract.viewBalanceAdminGovt();
        console.log("AdminGovt Balance:", balance.toString());
    } catch (error) {
        console.error("Error calling contract function:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
