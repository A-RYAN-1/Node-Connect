# Node Connect - Decentralized Chat Application 💬⛓️

The decentralized chat application aims to offer an immutable, privacy-focused, and highly resilient alternative to traditional messaging platforms, ensuring uninterrupted and tamper-proof communication. Additionally, users are rewarded with crypto tokens for their activity and transactions on the application. These tokens will be listed on exchanges in the future, allowing users to trade them at market price.

---

## ✨ Features

-   **Decentralized Chat**: Send and receive messages securely on the Ethereum blockchain.
-   **Token Rewards**: Earn crypto tokens for engaging in chats and being active.
-   **Friend System**: Easily add and manage your list of friends.
-   **User Leaderboard**: View top users ranked by their token balance.
-   **MetaMask Integration**: Seamlessly connect your wallet to access the app.
-   **Mobile & Desktop Support**: Fully responsive UI for a great experience on any device.

---

## 📋 Prerequisites

-   **Node.js**: Version `18.x` or higher.
-   **npm** or **yarn**.
-   **MetaMask**: Browser extension installed and configured.
-   **An Ethereum Testnet**: This project is configured to work with the **Holesky testnet**.

---

## 🛠️ Tech Stack

-   **Frontend**: React.js, Next.js, CSS Modules
-   **Blockchain**: Ethereum, Solidity, Ethers.js, Web3Modal
-   **Backend**: Smart Contracts deployed on the Ethereum **Holesky Testnet**
-   **Development Tools**: VS Code

---

## 🚀 Project Setup

Follow these steps to get the project running on your local machine.

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/A-RYAN-1/Node-Connect.git
    cd node-connect
    ```

2.  **Install Dependencies**
    This will install all the necessary packages, including Ethers.js and Web3Modal.
    ```bash
    npm install
    ```

3.  **Deploy the Smart Contract**
    The smart contract needs to be deployed to the **Holesky testnet**. You will need some Holesky ETH from a faucet to cover the gas fees.
    ```bash
    npm run deploy
    ```
    This will give you Contract Address say x, copy x and paste it in .env.local's NEXT_PUBLIC_CONTRACT_ADDRESS.
    And after that replace ChatApp.json in Context folder with ChatApp.json in artifacts folder's contracts.

    > **Note on Local Testing with Hardhat**: Recent versions of Next.js may have compatibility issues with Hardhat's local development environment. If you wish to test the smart contract locally using Hardhat, you may need to **downgrade the Next.js version** in the `package.json` file. For this guide, we are proceeding with the Holesky testnet.

4.  **Run the Application**
    ```bash
    npm run dev
    ```
    Open **[http://localhost:3000](http://localhost:3000)** in your browser to see the application running.

---

## 📖 Usage

-   **Connect Wallet**: Click the “Connect Wallet” button and approve the connection request from MetaMask.
-   **Create Account**: Enter a username to register your wallet address on the platform.
-   **Add Friends**: Browse the list of registered users and add them as friends.
-   **Send Messages**: Select a friend from your list to open the chat window and start sending messages.
-   **Earn Tokens**: Tokens are automatically rewarded for sending messages, as configured in the smart contract.
-   **View Leaderboard**: Check the leaderboard to see the top users ranked by their token balances.

---

## ⚙️ How It Works

### Wallet Integration
The application checks if MetaMask is installed and prompts the user to connect their wallet. It uses `handleNetworkSwitch()` to ensure the user is connected to the correct network (Holesky).

### Smart Contract Interaction
Ethers.js is used to communicate with the deployed smart contract. All key actions like creating an account, sending a message, and adding a friend are processed as transactions on the blockchain. User data and messages are read directly from the contract's state.

### Token Reward System
The smart contract includes logic to reward users with tokens for performing certain actions, such as sending a message. This encourages user engagement and platform activity.

### React Context
The `ChatAppContext` manages the global state of the application, including the user's account information, messages, friends list, and token balance, making this data accessible across all components.

### Frontend
The user interface is built with Next.js and styled using CSS Modules for a responsive and modern look. The UI is composed of several key components: `NavBar`, `FriendList`, `Chat`, `UserCard`, `Loader`, `Model`, and `Error`.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1.  **Fork** the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m "Add some AmazingFeature"`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a **Pull Request**.
