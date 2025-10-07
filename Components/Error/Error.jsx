import React from "react";
import styles from "./Error.module.css";

const Error = ({ error }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.icon}>⚠️</div>
        <h1 className={styles.title}>Something Went Wrong</h1>
        <p className={styles.message}>
          Please fix the following issue and reload your browser:
        </p>
        <p className={styles.errorText}>{error}</p>
        <button
          className={styles.reloadButton}
          onClick={() => window.location.reload()}
        >
          🔄 Reload
        </button>
      </div>
    </div>
  );
};

export default Error;
