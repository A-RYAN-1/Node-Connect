// Networks MetaMask can be switched to, keyed by NEXT_PUBLIC_NETWORK.
// Holesky was retired in 2025; Hoodi is its replacement testnet.
const toHex = (chainId) => `0x${chainId.toString(16)}`;

export const networks = {
  hoodi: {
    chainId: toHex(560048),
    chainName: "Hoodi",
    nativeCurrency: { name: "Hoodi Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://ethereum-hoodi-rpc.publicnode.com"],
    blockExplorerUrls: ["https://hoodi.etherscan.io"],
  },
  sepolia: {
    chainId: toHex(11155111),
    chainName: "Sepolia",
    nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://ethereum-sepolia-rpc.publicnode.com"],
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
  },
  localhost: {
    chainId: toHex(1337),
    chainName: "Hardhat localhost",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["http://127.0.0.1:8545"],
  },
};
