require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Deployment settings come from .env (see .env.example). They are only
// needed for `npm run deploy`; compile and test run without them.
const { HOODI_RPC_URL, DEPLOYER_PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    hoodi: {
      url: HOODI_RPC_URL || "https://ethereum-hoodi-rpc.publicnode.com",
      accounts: DEPLOYER_PRIVATE_KEY ? [DEPLOYER_PRIVATE_KEY] : [],
      chainId: 560048,
    },
  },
};
