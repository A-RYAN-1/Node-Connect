import React from "react";
import Image from "next/image";

// INTERNAL IMPORT
import Style from "./UserCard.module.css";
import images from "../../assets";

const UserCard = ({ el, i, addFriends }) => {
  return (
    <div className={Style.UserCard}>
      <div className={Style.UserCard_box}>
        {/* User Image */}
        <div className={Style.UserCard_box_img_wrapper}>
          <Image
            className={Style.UserCard_box_img}
            src={images[`image${i + 1}`]}
            alt="user"
            width={100}
            height={100}
          />
        </div>

        {/* User Info */}
        <div className={Style.UserCard_box_info}>
          <div className={Style.UserCard_box_name}>
            <h3>{el.name}</h3>
            {/* Future token display can go here */}
          </div>
          <p>{el.accountAddress.slice(0, 25)}..</p>
          <button
            onClick={() =>
              addFriends({ name: el.name, userAddress: el.accountAddress })
            }
          >
            Add Friend
          </button>
        </div>
      </div>

      {/* Card Index */}
      <span className={Style.number}>{i + 1}</span>
    </div>
  );
};

export default UserCard;
