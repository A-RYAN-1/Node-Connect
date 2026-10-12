# Node Connect - Decentralized Chat Application 💬⛓️

[![CI](https://github.com/A-RYAN-1/Node-Connect/actions/workflows/ci.yml/badge.svg)](https://github.com/A-RYAN-1/Node-Connect/actions/workflows/ci.yml)
[![Uptime](https://github.com/A-RYAN-1/Node-Connect/actions/workflows/uptime.yml/badge.svg)](https://github.com/A-RYAN-1/Node-Connect/actions/workflows/uptime.yml)

A decentralised chat application on Ethereum: an immutable, tamper-proof alternative to traditional messaging platforms. Accounts, friendships and messages live in a smart contract, you sign in with MetaMask, and the contract rewards you with tokens for being active.

**Live:** https://node-connect-sigma.vercel.app (Hoodi testnet)
**Contract:** [`0x1C562FBbeA759113364Bf1EF282af19Bd8FD1A9f`](https://hoodi.etherscan.io/address/0x1C562FBbeA759113364Bf1EF282af19Bd8FD1A9f) on Hoodi

---

## ✨ Features

-   **Decentralized Chat**: Send and receive messages stored on the Ethereum blockchain.
-   **Token Rewards**: Earn tokens for creating an account, adding friends and chatting.
-   **Friend System**: Add registered users as friends; the friendship is recorded both ways.
-   **User Leaderboard**: View top users ranked by their token balance.
-   **MetaMask Integration**: Connect your wallet; the app switches MetaMask to the right network for you.
-   **Mobile & Desktop Support**: Responsive UI for any device.

---

## 🛠️ Tech Stack

-   **Frontend**: Next.js 16 (static export), React 18, CSS Modules
-   **Blockchain**: Solidity 0.8.19, Hardhat, ethers.js 6, MetaMask
-   **Network**: Ethereum **Hoodi testnet** (Holesky, used before, was retired in 2025)
-   **Hosting**: Vercel (static files only; there is no server)
-   **Tooling**: Node 22 pinned with [mise](https://mise.jdx.dev), ESLint, GitHub Actions

---

## ⚙️ How It Works

The whole backend is one contract, `contracts/ChatApp.sol`. It stores each user's name and friend list, every chat as an array of messages keyed by the hash of the two addresses, and a reward balance per address (5 tokens for an account, 1 per friendship and 1 per message for both sides). The frontend is a static Next.js export with no server: it reads the contract directly from the browser through MetaMask (`Utils/apiFeature.js`), and every write (create account, add friend, send message) is a transaction the user signs. `Context/ChatAppContext.js` holds the app state and refreshes it after each transaction is mined. Configuration is read once, in `Context/config.js`, which stops the build with a clear message when a variable is missing or wrong.

```
Browser (Next.js static site on Vercel)
   │  MetaMask signs transactions, ethers.js encodes calls
   ▼
ChatApp contract on Hoodi ── accounts, friends, messages, rewards
```

---

## 🚀 Run It Locally

**Prerequisites:** Git, [mise](https://mise.jdx.dev) (or Node 22 installed another way), and the MetaMask browser extension.

1.  **Clone the repository**
    ```bash
    git clone https://github.com/A-RYAN-1/Node-Connect.git
    cd Node-Connect
    ```

2.  **Install Node 22 and the dependencies**
    ```bash
    mise install   # reads mise.toml
    npm ci
    ```

3.  **Set the environment variables**
    ```bash
    cp .env.example .env
    ```
    The defaults point at the public Hoodi deployment, so the app works without changing anything. `.env` is git-ignored; never commit it.

4.  **Start the app**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000), connect MetaMask and approve the switch to Hoodi. Creating an account and sending messages cost a little Hoodi ETH, which is free from a Hoodi faucet, for example the [Google Cloud faucet](https://cloud.google.com/application/web3/faucet/ethereum/hoodi) or the [PoW faucet](https://hoodi-faucet.pk910.de/).

### Run everything on a local chain (no testnet ETH needed)

```bash
npm run node            # terminal 1: local Hardhat chain on http://127.0.0.1:8545
npm run deploy-local    # terminal 2: prints the contract address
```

Set `NEXT_PUBLIC_CONTRACT_ADDRESS` to the printed address and `NEXT_PUBLIC_NETWORK=localhost` in `.env`, run `npm run dev`, and import one of the test accounts `npm run node` prints into MetaMask. Those accounts and keys are public and only for the local chain.

### Deploy your own contract to Hoodi

1.  Create a fresh MetaMask account that will only ever hold testnet ETH, and fund it from a Hoodi faucet.
2.  Put its private key in `.env` as `DEPLOYER_PRIVATE_KEY` (optionally an Alchemy or Infura URL as `HOODI_RPC_URL`).
3.  Run `npm run deploy` and set `NEXT_PUBLIC_CONTRACT_ADDRESS` to the address it prints.
4.  If you changed the contract, run `npm run abi` so the frontend uses the new ABI.

---

## 🗂️ Project Structure

```
contracts/ChatApp.sol      the smart contract (accounts, friends, messages, rewards)
test/ChatApp.test.js       contract tests (Hardhat)
scripts/deploy.js          deploys the contract; export-abi.js copies the ABI to Context/
Context/config.js          reads and checks every environment variable (the only place that does)
Context/networks.js        networks MetaMask can be switched to
Context/ChatAppContext.js  app state, refreshed after each mined transaction
Utils/apiFeature.js        MetaMask connection and the contract instance
Components/                UI components (NavBar, Friend list and Chat, UserCard, Model, ...)
pages/                     routes: / (chat), /alluser (find friends), /leaderboard
```

---

## 🔑 Environment Variables

All of them are listed with comments in [`.env.example`](.env.example).

| Variable | Needed for | What it is |
|---|---|---|
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | the app (build time) | Address of the deployed `ChatApp` contract. Public. |
| `NEXT_PUBLIC_NETWORK` | the app (build time) | Network MetaMask is switched to: `hoodi`, `sepolia` or `localhost` (see `Context/networks.js`). Public. |
| `HOODI_RPC_URL` | `npm run deploy` | Hoodi RPC URL. Optional; defaults to the free public node. |
| `DEPLOYER_PRIVATE_KEY` | `npm run deploy` | Key of a testnet-only deployer wallet. Secret: only in your local `.env`, never on the host. |

`NEXT_PUBLIC_` values are compiled into the public JavaScript, so they must never hold a secret.

---

## 🧪 Scripts and Tests

| Command | What it does |
|---|---|
| `npm run dev` | Start the app on port 3000 |
| `npm run build` | Static export to `out/` |
| `npm run lint` | ESLint (Next.js core web vitals rules) |
| `npm test` | Contract tests (Hardhat, 9 tests: accounts, friends, messages, mining) |
| `npm run abi` | Compile and copy the contract ABI into `Context/ChatApp.json` |
| `npm run deploy` / `deploy-local` | Deploy the contract to Hoodi / the local chain |

GitHub Actions runs lint, the contract tests, an ABI freshness check and the build on every push (`ci.yml`), and checks once a day that the live site answers (`uptime.yml`).

---

## ☁️ Deployment

The site is a static export hosted on Vercel's free Hobby plan. To host your own copy:

1.  Import the repository in Vercel (framework: Next.js, no root directory).
2.  Set `NEXT_PUBLIC_CONTRACT_ADDRESS` and `NEXT_PUBLIC_NETWORK` in the project's Environment Variables for Production and Preview. Nothing secret is needed.
3.  Deploy. `vercel.json` adds security headers; `.vercelignore` keeps env files and build output out of CLI uploads.

**Measured on the live site** (Lighthouse, 2026-10-12, mobile / desktop): performance 89-90 / 99, accessibility 100 / 100, best practices 100 / 100, SEO 100 / 100.

`npm audit --omit=dev` reports no vulnerabilities in what ships to the browser. The remaining `npm audit` findings are in Hardhat's development toolchain, which only runs locally and in CI.

---

## 🩺 Troubleshooting

-   **The build stops with a config error.** `Context/config.js` checks the variables; copy `.env.example` to `.env` (or set them on the host) and build again.
-   **MetaMask shows the wrong network.** Click Connect Wallet again and approve the network switch; the app adds Hoodi to MetaMask if it is missing.
-   **A transaction fails with "insufficient funds".** The account needs a little Hoodi ETH; use one of the faucets above.
-   **Local chain: MetaMask reports a nonce error after restarting `npm run node`.** The chain was reset; in MetaMask, Settings, Advanced, clear the activity data for that account.
-   **`npm ci` fails on Node 18 or 20.** The project needs Node 22 (`mise install`).

---

## 📖 Usage

-   **Connect Wallet**: Click "Connect Wallet" and approve the connection request in MetaMask.
-   **Create Account**: Enter a username to register your wallet address on the platform.
-   **Add Friends**: Browse the list of registered users and add them as friends.
-   **Send Messages**: Select a friend to open the chat and send messages (Enter sends).
-   **Earn Tokens**: Tokens are rewarded automatically by the smart contract.
-   **View Leaderboard**: See the top users ranked by their token balances.

---

## 📷 Working Demo

Account Creation :-

https://github.com/user-attachments/assets/43d3d235-4ac0-4a97-ad3a-c0e051cf8d9f

Adding Friends :-

https://github.com/user-attachments/assets/3ce3d386-fd47-40f3-bfa0-f8130f7e015f

Chatting & Rewards :-

https://github.com/user-attachments/assets/969e8a48-07a7-49d1-84f5-1f372f9aaae2

---

## 🧭 Status and Roadmap

Production baseline reached on 2026-10-12: Next.js 16 and ethers 6, contract tests, lint and build in CI, a config module with checked environment variables, security headers, a daily uptime check and Lighthouse scores above. Next steps, one at a time:

-   [ ] Faster first load on mobile: the GIFs in `assets/` weigh about 14 MB; convert them to video or WebP.
-   [ ] Deploy automatically on every push to `main` (Vercel Git integration).
-   [ ] Frontend tests for the main flow (connect, create account, add friend, send message).

---

## 🤝 Contributing

Contributions are welcome:

1.  **Fork** the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Run `npm run lint`, `npm test` and `npm run build` before committing.
4.  Push the branch and open a **Pull Request**; CI runs the same checks.

---

## 📄 License

[MIT](LICENSE)
