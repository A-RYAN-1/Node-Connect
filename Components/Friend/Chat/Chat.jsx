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
  const router = useRouter();
  // The open chat comes from the URL (?name=...&address=...)
  const chatData = {
    name: router.query.name || "",
    address: router.query.address || "",
  };

  useEffect(() => {
    if (chatData.address) {
      readMessage(chatData.address);
      readUser(chatData.address);
    }
  }, [chatData.address, readMessage, readUser]);

  const send = async () => {
    const text = message.trim();
    if (!text) return;
    await functionName({ msg: text, address: chatData.address });
    setMessage("");
  };

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
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) send();
                }}
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
                  role="button"
                  tabIndex={0}
                  onClick={send}
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
