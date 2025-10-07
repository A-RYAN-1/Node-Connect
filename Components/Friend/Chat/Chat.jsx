import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

// INTERNAL IMPORT
import Style from "./Chat.module.css";
import images from "../../../assets";
import { converTime } from "../../../Utils/apiFeature";
import { Loader } from "../../index";

const Chat = ({
  functionName,
  readMessage,
  friendMsg,
  account,
  userName,
  loading,
  currentUserName,
  currentUserAddress,
  readUser,
}) => {
  const [message, setMessage] = useState("");
  const [chatData, setChatData] = useState({ name: "", address: "" });
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    setChatData(router.query);
  }, [router.isReady]);

  useEffect(() => {
    if (chatData.address) {
      readMessage(chatData.address);
      readUser(chatData.address);
    }
  }, [chatData.address]);

  return (
    <div className={Style.Chat}>
      {/* User Info Header */}
      {currentUserName && currentUserAddress && (
        <div className={Style.Chat_user_info}>
          <Image
            src={images.accountName}
            alt="User Avatar"
            width={70}
            height={70}
            className={Style.Chat_user_info_img}
          />
          <div className={Style.Chat_user_info_box}>
            <h4>{currentUserName}</h4>
            <p className={Style.show}>{currentUserAddress}</p>
          </div>
        </div>
      )}

      {/* Chat Body */}
      <div className={Style.Chat_box_container}>
        <div className={Style.Chat_box}>
          <div className={Style.Chat_box_left}>
            {friendMsg.length > 0 ? (
              friendMsg.map((el, i) => (
                <div key={i} className={Style.Chat_message_block}>
                  <div className={Style.Chat_box_left_title}>
                    <Image
                      src={images.accountName}
                      alt="Profile"
                      width={50}
                      height={50}
                      className={Style.Chat_box_left_img}
                    />
                    <span>
                      {el.sender === chatData.address
                        ? chatData.name
                        : userName}
                      <small>Time: {converTime(el.timestamp)}</small>
                    </span>
                  </div>
                  <p>{el.msg}</p>
                </div>
              ))
            ) : (
              <p className={Style.no_message}>
                No messages yet. Start chatting!
              </p>
            )}
          </div>
        </div>

        {/* Message Input Box */}
        {currentUserName && currentUserAddress && (
          <div className={Style.Chat_box_send}>
            <div className={Style.Chat_box_send_img}>
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              {loading ? (
                <Loader />
              ) : (
                <Image
                  src={images.send}
                  alt="Send Message"
                  width={45}
                  height={45}
                  className={Style.send_icon}
                  onClick={() =>
                    functionName({
                      msg: message,
                      address: router.query.address,
                    })
                  }
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
