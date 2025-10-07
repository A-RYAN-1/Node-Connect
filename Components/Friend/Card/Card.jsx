import React from "react";
import Image from "next/image";
import Link from "next/link";

// INTERNAL IMPORT
import styles from "./Card.module.css";
import images from "../../../assets";

const Card = ({ readMessage, el, i, readUser }) => {
  return (
    <div
      onClick={() => {
        readMessage(el.pubkey);
        readUser(el.pubkey);
      }}
    >
      <Link
        href={{
          pathname: "/",
          query: { name: `${el.name}`, address: `${el.pubkey}` },
        }}
      >
        <div className={styles.card}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              <Image
                src={images.accountName}
                alt="user avatar"
                width={60}
                height={60}
                className={styles.avatarImage}
              />
            </div>
          </div>

          <div className={styles.infoSection}>
            <div className={styles.infoText}>
              <h3>{el.name}</h3>
              <p>{el.pubkey.slice(21)}..</p>
            </div>

            <div className={styles.indexBadge}>
              <span>{i + 1}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Card;
