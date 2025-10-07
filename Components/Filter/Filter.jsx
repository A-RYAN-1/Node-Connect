import React from "react";
import styles from "./Filter.module.css";

const Filter = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.filter}>
        <p className={styles.infoText}>
          Welcome to Node Connect, where you can earn tokens by engaging in
          chats! You can always check your token balance in the top right
          corner.
        </p>
      </div>
    </div>
  );
};

export default Filter;
