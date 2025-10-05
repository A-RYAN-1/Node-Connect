import React, { useEffect, useState, useContext } from "react";
import { ChatAppContect } from "../Context/ChatAppContext";
import { connectingWithContract } from "../Utils/apiFeature";
import { UserCard } from "../Components/index";
import Style from "../styles/leaderboard.module.css";

const Leaderboard = () => {
const { userListsforleaderboard } = useContext(ChatAppContect);


  return (
     <div className={Style.LeaderboardContainer}>
      <h1>Leaderboard</h1>
      <table className={Style.LeaderboardTable}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Tokens</th>
          </tr>
        </thead>
        <tbody>
          {userListsforleaderboard.map((user, index) => (
            <tr key={user.accountAddress}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.tokens}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
