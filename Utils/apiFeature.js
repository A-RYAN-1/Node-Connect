import { BrowserProvider, Contract } from "ethers";

import {
  ChatAppAddress,
  ChatAppABI,
  handleNetworkSwitch,
} from "../Context/constants";

export const hasWallet = () =>
  typeof window !== "undefined" && Boolean(window.ethereum);

// Returns the connected account without prompting, or "" if none.
export const checkIfWalletConnected = async () => {
  if (!hasWallet()) return "";
  const accounts = await window.ethereum.request({ method: "eth_accounts" });
  return accounts[0] || "";
};

// Prompts MetaMask to connect, switches to the configured network and
// returns the selected account.
export const connectWallet = async () => {
  if (!hasWallet()) throw new Error("MetaMask is not installed");
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  await handleNetworkSwitch();
  return accounts[0] || "";
};

export const connectingWithContract = async () => {
  if (!hasWallet()) throw new Error("MetaMask is not installed");
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new Contract(ChatAppAddress, ChatAppABI, signer);
};

// ethers v6 returns structs as Result proxies whose named fields are lost
// when spread, so the UI gets plain objects instead.
export const toUser = (u) => ({ name: u.name, accountAddress: u.accountAddress });
export const toFriend = (f) => ({ name: f.name, pubkey: f.pubkey });
export const toMessage = (m) => ({
  sender: m.sender,
  timestamp: Number(m.timestamp),
  msg: m.msg,
});

// Pulls the revert reason or MetaMask message out of an ethers error.
export const errorMessage = (error) =>
  error?.reason ||
  error?.info?.error?.message ||
  error?.shortMessage ||
  error?.message ||
  "Something went wrong";

export const converTime = (seconds) => {
  const date = new Date(Number(seconds) * 1000);

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${hours}:${minutes} ${ampm}  Date: ${day}/${month}/${year}`;
};
