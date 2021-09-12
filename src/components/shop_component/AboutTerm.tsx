import React, { useState, useEffect } from "react";
import style from "./about-term.module.scss";
import { Space } from "antd";
import { useTranslation } from "next-i18next";

const shareIconList = [
  "assets/icons/share/facebook.svg",
  "assets/icons/share/twitter.svg",
  "assets/icons/share/line.svg",
  "assets/icons/share/pinterest.svg",
  "assets/icons/share/SHARE_LINK.svg",
];

export const AboutTerm = ( {coverImage = ""} ) => {
  const { t } = useTranslation();

  const [windowHref, setWindowHref] = useState("");

  useEffect(() => {
    setWindowHref(window.location.href.replace("&", "%26"));
  }, []);

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${windowHref}`,
      "_blank"
    );
  };

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${windowHref}`,
      "_blank"
    );
  };

  const shareToLine = () => {
    window.open(
      `https://social-plugins.line.me/lineit/share?url=${windowHref}`,
      "_blank"
    );
  };

  const shareToPinterest = () => {
    window.open(
      `https://www.pinterest.com/pin-builder/?url=${windowHref}%3Futm_source%3Ddynamic%26utm_campaign%3Dbfsharepinterest&description=${"Share"}&media=${coverImage}`,
      "_blank"
    );
  };

  const copyLink = () => {
    var dummy = document.createElement("input"),
      text = windowHref;

    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  };

  const LeftItems = () => {
    return (
      <Space size={60}>
        <a
          href="https://www.w3schools.com"
          target="_blank"
          className={`${style["left-item"]} ${style["cursor-pointer"]}`}
        >
          {t("shop:aboutTerm.about")}
        </a>
        <a
          href="https://www.w3schools.com"
          target="_blank"
          className={`${style["left-item"]} ${style["cursor-pointer"]}`}
        >
          {t("shop:aboutTerm.contact")}
        </a>
      </Space>
    );
  };

  const handleShare = (key) => {
    switch (key) {
      case 0:
        shareToFacebook();
        break;
      case 1:
        shareToTwitter();
        break;
      case 2:
        shareToLine();
        break;
      case 3:
        shareToPinterest();
        break;
      case 4:
        copyLink();
        break;
    }
  };

  const RightItems = () => {
    return (
      <span style={{ marginLeft: "auto" }}>
        <Space size={24}>
          <span className={`${style["right-item"]}`}>
            {t("shop:aboutTerm.share")}
          </span>
          {shareIconList.map((el, index) => {
            return (
              <img
                key={index}
                onClick={() => handleShare(index)}
                src={el}
                height={24}
                width={24}
                className={`${style["cursor-pointer"]}`}
              />
            );
          })}
        </Space>
      </span>
    );
  };

  return (
    <div className={`${style["container"]}`}>
      <LeftItems />
      <RightItems />
    </div>
  );
};
