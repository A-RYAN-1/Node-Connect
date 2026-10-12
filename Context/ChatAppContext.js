import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";

import {
  checkIfWalletConnected,
  connectWallet as requestWallet,
  connectingWithContract,
  hasWallet,
  toUser,
  toFriend,
  toMessage,
  errorMessage,
} from "../Utils/apiFeature";

export const ChatAppContect = React.createContext();

const sameAddress = (a, b) => a.toLowerCase() === b.toLowerCase();

export const ChatAppProvider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [userName, setUserName] = useState("");
  const [friendLists, setFriendLists] = useState([]);
  const [friendMsg, setFriendMsg] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLists, setUserLists] = useState([]);
  const [userListsforleaderboard, setUserListsforleaderboard] = useState([]);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [error, setError] = useState("");

  // The friend whose chat is open
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserAddress, setCurrentUserAddress] = useState("");

  const router = useRouter();

  const loadAccount = useCallback(async (address) => {
    const contract = await connectingWithContract();

    const registered = await contract.checkUserExists(address);
    const [allUsers, friends] = await Promise.all([
      contract.getAllAppUser().then((list) => list.map(toUser)),
      registered
        ? contract.getMyFriendList().then((list) => list.map(toFriend))
        : [],
    ]);

    setUserName(registered ? await contract.getUsername(address) : "");
    setFriendLists(friends);

    // Users you can add: everyone except you and your friends
    const friendAddresses = new Set(friends.map((f) => f.pubkey.toLowerCase()));
    setUserLists(
      allUsers.filter(
        (u) =>
          !sameAddress(u.accountAddress, address) &&
          !friendAddresses.has(u.accountAddress.toLowerCase())
      )
    );

    const rewards = await Promise.all(
      allUsers.map((u) => contract.minerReward(u.accountAddress))
    );
    const leaderboard = allUsers
      .map((u, i) => ({ ...u, tokens: Number(rewards[i]) }))
      .sort((a, b) => b.tokens - a.tokens);
    setUserListsforleaderboard(leaderboard);

    const mine = leaderboard.find((u) => sameAddress(u.accountAddress, address));
    setTokenBalance(mine ? mine.tokens : 0);
  }, []);

  // Load the already-connected account (no MetaMask prompt) on page load
  useEffect(() => {
    checkIfWalletConnected()
      .then(async (address) => {
        if (!address) return;
        setAccount(address);
        await loadAccount(address);
      })
      .catch((err) => setError(errorMessage(err)));

    if (!hasWallet()) return undefined;
    // Reload the data when the user switches account in MetaMask
    const onAccountsChanged = () => window.location.reload();
    window.ethereum.on?.("accountsChanged", onAccountsChanged);
    return () =>
      window.ethereum.removeListener?.("accountsChanged", onAccountsChanged);
  }, [loadAccount]);

  const connectWallet = async () => {
    try {
      const address = await requestWallet();
      if (!address) return;
      setAccount(address);
      await loadAccount(address);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  // Sends a transaction, waits for it to be mined, then runs `after`
  const runTransaction = async (send, after) => {
    try {
      const contract = await connectingWithContract();
      const tx = await send(contract);
      setLoading(true);
      await tx.wait();
      setLoading(false);
      await after();
    } catch (err) {
      setLoading(false);
      setError(errorMessage(err));
    }
  };

  const readMessage = useCallback(async (friendAddress) => {
    try {
      const contract = await connectingWithContract();
      const messages = await contract.readMessage(friendAddress);
      setFriendMsg(messages.map(toMessage));
    } catch (err) {
      setError(errorMessage(err));
    }
  }, []);

  const createAccount = async ({ name }) => {
    if (!name?.trim() || !account)
      return setError("Name and account address cannot be empty");
    await runTransaction(
      (contract) => contract.createAccount(name.trim()),
      () => loadAccount(account)
    );
  };

  const addFriends = async ({ name, userAddress }) => {
    if (!name || !userAddress) return setError("Please provide a name and address");
    await runTransaction(
      (contract) => contract.addFriend(userAddress, name),
      async () => {
        await loadAccount(account);
        router.push("/");
      }
    );
  };

  const sendMessage = async ({ msg, address }) => {
    if (!msg?.trim() || !address) return setError("Please type your message");
    await runTransaction(
      (contract) => contract.sendMessage(address, msg),
      async () => {
        await readMessage(address);
        await loadAccount(account);
      }
    );
  };

  const readUser = useCallback(async (userAddress) => {
    try {
      const contract = await connectingWithContract();
      setCurrentUserName(await contract.getUsername(userAddress));
      setCurrentUserAddress(userAddress);
    } catch (err) {
      setError(errorMessage(err));
    }
  }, []);

  return (
    <ChatAppContect.Provider
      value={{
        readMessage,
        createAccount,
        addFriends,
        sendMessage,
        readUser,
        connectWallet,
        account,
        userName,
        friendLists,
        friendMsg,
        userLists,
        loading,
        error,
        clearError: () => setError(""),
        currentUserName,
        currentUserAddress,
        userListsforleaderboard,
        tokenBalance,
      }}
    >
      {children}
    </ChatAppContect.Provider>
  );
};
