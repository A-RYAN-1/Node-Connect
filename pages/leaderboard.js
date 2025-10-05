import React, { useState, useEffect, useContext } from "react";
// INTERNAL IMPORT
import { UserCard } from "../Components/index";
import Style from "../styles/alluser.module.css";
import { ChatAppContect } from "../Context/ChatAppContext";

const Leaderboard = () => {
  const { userLists, connectingWithContract } = useContext(ChatAppContect);
  const [sortedUsers, setSortedUsers] = useState([]);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const contract = await connectingWithContract();

        // Fetch balances for all users
        const usersWithBalance = await Promise.all(
          userLists.map(async (user) => {
            const balance = await contract.tokenBalance(user.accountAddress);
            return {
              ...user,
              balance: balance.toNumber(), // convert BigNumber
            };
          })
        );

        // Sort descending by balance
        usersWithBalance.sort((a, b) => b.balance - a.balance);
        setSortedUsers(usersWithBalance);
      } catch (error) {
        console.log("Error fetching balances:", error);
      }
    };

    if (userLists.length > 0) fetchBalances();
  }, [userLists, connectingWithContract]);

  return (
    <div>
      <div className={Style.alluser_info}>
        <h1>Leaderboard</h1>
      </div>

      <div className={Style.alluser}>
        {sortedUsers.map((el, i) => (
          <UserCard key={i + 1} el={el} i={i} />
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
