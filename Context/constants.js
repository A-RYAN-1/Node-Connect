import chatApp from "./ChatApp.json";
import { CONTRACT_ADDRESS, NETWORK } from "./config";

export const ChatAppAddress = CONTRACT_ADDRESS;
export const ChatAppABI = chatApp.abi;

// Switch MetaMask to the configured network, adding it first if MetaMask
// does not know it yet (error 4902).
export const handleNetworkSwitch = async () => {
  if (!window.ethereum) throw new Error("MetaMask is not installed");
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: NETWORK.chainId }],
    });
  } catch (error) {
    if (error.code !== 4902) throw error;
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [NETWORK],
    });
  }
};
