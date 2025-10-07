import React, { useContext } from "react";
import Image from "next/image";

// INTERNAL IMPORT
import Style from "./Friend.module.css";
import images from "../../assets";
import Card from "./Card/Card";
import Chat from "./Chat/Chat";
import { ChatAppContect } from "../../Context/ChatAppContext";

const Friend = () => {
  const {
    sendMessage,
    account,
    friendLists,
    readMessage,
    userName,
    loading,
    friendMsg,
    currentUserName,
    currentUserAddress,
    readUser,
  } = useContext(ChatAppContect);

  return (
    <div className={Style.Friend}>
      <div className={Style.Friend_box}>
        {/* Left Side - Friend List */}
        <div className={Style.Friend_box_left}>
          <h3 className={Style.section_title}>Friends</h3>
          {friendLists && friendLists.length > 0 ? (
            friendLists.map((el, i) => (
              <Card
                key={i}
                el={el}
                i={i}
                readMessage={readMessage}
                readUser={readUser}
              />
            ))
          ) : (
            <p className={Style.no_friends}>No friends added yet.</p>
          )}
        </div>

        {/* Right Side - Chat Section */}
        <div className={Style.Friend_box_right}>
          <Chat
            functionName={sendMessage}
            readMessage={readMessage}
            friendMsg={friendMsg}
            account={account}
            userName={userName}
            loading={loading}
            currentUserName={currentUserName}
            currentUserAddress={currentUserAddress}
            readUser={readUser}
          />
        </div>
      </div>
    </div>
  );
};

export default Friend;
