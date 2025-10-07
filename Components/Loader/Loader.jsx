import React from "react";
import Image from "next/image";
import Style from "./Loader.module.css";
import images from "../../assets";

const Loader = () => {
  return (
    <div className={Style.Loader}>
      <div className={Style.Loader_box}>
        <div className={Style.Loader_glow}></div>
        <div className={Style.Loader_spinner}>
          <Image
            src={images.loader}
            alt="Loading..."
            width={100}
            height={100}
            className={Style.Loader_img}
          />
        </div>
        <p className={Style.Loader_text}>Please wait, loading your chat...</p>
      </div>
    </div>
  );
};

export default Loader;
