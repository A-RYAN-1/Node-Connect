import React, { useState, useContext } from "react";
import Image from "next/image";

// INTERNAL IMPORT
import Style from "./Model.module.css";
import images from "../../assets";
import { ChatAppContect } from "../../Context/ChatAppContext";
import { Loader } from "../../Components/index";

const Model = ({
  openBox,
  title,
  address,
  head,
  info,
  smallInfo,
  image,
  functionName,
}) => {
  const [name, setName] = useState("");
  const [userAddress, setUserAddress] = useState(address);

  const { loading } = useContext(ChatAppContect);

  return (
    <div className={Style.Model}>
      <div className={Style.Model_box}>
        <div className={Style.Model_box_left}>
          <Image
            src={image}
            alt="buddy"
            width={700}
            height={700}
            className={Style.Model_box_left_img}
          />
        </div>

        <div className={Style.Model_box_right}>
          <h1>
            {title} <span>{head}</span>
          </h1>
          <p>{info}</p>
          <small>{smallInfo}</small>

          {loading ? (
            <Loader />
          ) : (
            <div className={Style.Model_box_right_name}>
              {/* Name Input */}
              <div className={Style.Model_box_right_name_info}>
                <Image
                  src={images.username}
                  alt="user"
                  width={30}
                  height={30}
                />
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Address Input */}
              <div className={Style.Model_box_right_name_info}>
                <Image src={images.account} alt="user" width={30} height={30} />
                <input
                  type="text"
                  placeholder={address || "Enter address..."}
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className={Style.Model_box_right_name_btn}>
                <button
                  onClick={() => functionName({ name, userAddress })}
                  className={Style.submit_btn}
                >
                  <Image src={images.send} alt="send" width={30} height={30} />
                  Submit
                </button>

                <button
                  onClick={() => openBox(false)}
                  className={Style.cancel_btn}
                >
                  <Image
                    src={images.close}
                    alt="close"
                    width={30}
                    height={30}
                  />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Model;
