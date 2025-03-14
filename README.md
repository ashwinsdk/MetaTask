# Task Management DApp

A decentralized task management application with wallet authentication, task creation, and task completion tracking.

<img width="1470" alt="Screenshot 2025-03-14 at 5 25 57 PM" src="https://github.com/user-attachments/assets/37c4771b-a224-48b1-aa54-da31d2aa41b5" />

<img width="1470" alt="Screenshot 2025-03-14 at 5 26 09 PM" src="https://github.com/user-attachments/assets/74311f2f-cc31-42ca-bc93-278073e40509" />

## Features
- Wallet-based authentication (MetaMask)
- Add, modify, and delete tasks
- Task completion tracking
- Animated UI for smooth user experience

---

## Prerequisites
Ensure you have the following installed on your system:
- **Node.js** (v16+ recommended)
- **NPM** or **Yarn**
- **MetaMask Extension** (for testing authentication)
- **Hardhat** (for smart contract development)
- **Ganache or Hardhat Network** (for local blockchain deployment)

---

## Setup Instructions
### 1. Clone the Repository
```bash
git clone https://github.com/ashwinsdk/MetaTask.git
cd MetaTask
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add:
```env
INFURA_API_KEY=your_infura_api_key
PRIVATE_KEY=your_wallet_private_key
```

### 4. Start Local Blockchain (Using Hardhat)
```bash
npx hardhat node
```

### 5. Deploy Smart Contract
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

---

## Frontend Setup
### 1. Start the React Frontend
```bash
npm start
```

### 2. Connect MetaMask
- Open MetaMask
- Switch to Sepolia Testnet
- Ensure the deployed contract address is updated in the frontend

### 3. Access the Application
Go to: [http://localhost:3000](http://localhost:3000)

---

## Deployment
### 1. Build the React Application
```bash
npm run build
```

### 2. Deploy to Netlify
Use either of these commands:
  ```
- **Netlify:**
  ```bash
  netlify deploy --prod
  ```

---

## Notes
- The smart contract is deployed on the Sepolia Testnet using Infura.
- Update the frontend contract address after deployment.
- Ensure you have Sepolia ETH for gas fees (use Sepolia Faucet).
### Future Enhancements
- Integration with IPFS for decentralized storage
- Role-based access control
- Notifications for task updates

---

## License
MIT License

