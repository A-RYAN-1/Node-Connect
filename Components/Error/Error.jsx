import React from "react";
import styles from "./Error.module.css";

const Error = ({ error, onClose }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.icon}>⚠️</div>
        <h1 className={styles.title}>Something Went Wrong</h1>
        <p className={styles.message}>
          Please fix the following issue and try again:
        </p>
        <p className={styles.errorText}>{error}</p>
        <button
          className={styles.reloadButton}
          onClick={onClose}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default Error;
