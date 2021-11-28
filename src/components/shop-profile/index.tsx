import React, { useRef, useState, useEffect } from "react";
import { TwitterEmbbed } from "@components/twitter-homepage";
import { Modal, Input, Button, Row, Col } from "antd";
import { cnumberWithCommas } from "src/utils/common-function";
import { GetUserInfo } from "src/api/auth";
import style from "./shop-profile.module.scss";
import { useTranslation } from "react-i18next";
import ProfileAPI from "../../api/creator/profile";

const getMediaImage = (mediaLink, index) => {
  let urlImage = `media-default${index + 1}`;
  if (mediaLink?.includes("instagram")) {
    urlImage = "instagram";
  } else if (mediaLink?.includes("facebook")) {
    urlImage = "facebook";
  } else if (mediaLink?.includes("twitter")) {
    urlImage = "twitter";
  } else if (mediaLink?.includes("linkedin")) {
    urlImage = "linkedin";
  } else if (mediaLink?.includes("youtube")) {
    urlImage = "youtube";
  } else if (mediaLink?.includes("pinterest")) {
    urlImage = "pinterest";
  }
  return <img src={`assets/icons/plugins/${urlImage}.png`} width="54vw" />;
};

const SocialMediaItem = ({ mediaLink, index }) => {
  console.log({ mediaLink })
  return (
    <Col span={4} className={`${style["sns-item"]}`}>
      <Button
        type="link"
        href={mediaLink}
        target="_blank"
        className={`${style["sns-btn"]}`}
      >
        {getMediaImage(mediaLink, index)}
      </Button>
    </Col>
  );
};

export const ShopProfile = () => {
  let userInfo = GetUserInfo();
  const { t } = useTranslation();
  const [follower, setFollower] = useState(19527123);
  const [isFollowing, setIsFollowing] = useState(false);
  const [creatorInfo, setCreatorInfo] = useState(null);
  const [linkSns, setLinhSNS] = useState("billgates");
  const [mediaLinksComponent, setMediaLinksComponent] = useState([]);

  useEffect(() => {
    ProfileAPI.getProfile({
      userInfo: GetUserInfo(),
    }).then(data => {
      const link = data.sns?.split(".com/");
      setLinhSNS(link[1]);
      setCreatorInfo(data);
      setMediaLinksComponent(
        data.mediaLinks.map((mediaLink, i) => (
          <div style={{ width: "20%" }} key={i}>
            <SocialMediaItem mediaLink={mediaLink} index={i} />
          </div>
        ))
      );
    })
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      userInfo =
        window.localStorage && window.localStorage.getItem("userInfo")
          ? JSON.parse(window.localStorage.getItem("userInfo"))
          : {};
    }
  }, [userInfo]);

  const onClickFollow = () => {
  };

  return (
    <div className={`${style["profile-container"]}`}>
      <div className={`${style["profile-title"]}`}>{t("common:topPage.profile")}</div>
      <div className={`${style["all-box"]}`}>
        <div className={`${style["profile-main"]}`}>
          <div className={`${style["profile-info"]}`}>
            <div className={`${style["box"]}`}>
              <div className={`${style["top"]}`}>
                <img src={creatorInfo?.avatar || "assets/demo/demo-author.svg"} />
                <div className={`${style["creator-info"]}`}>
                  <div className={`${style["creator-name"]}`}>
                    {creatorInfo?.fullName}
                  </div>
                  <div className={`${style["creator-follow"]}`}>
                    <Button
                      type="primary"
                      className={`${style["follow-button"]}`}
                      onClick={() => onClickFollow()}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                    <span className={`${style["creator-followers"]}`}>
                      {cnumberWithCommas(follower)}{" "}
                      {follower > 1 ? `${t("common:followers")}` : `${t("common:follower")}`}
                    </span>
                  </div>
                </div>
              </div>
              <div className={`${style["introduction"]}`}>
                {creatorInfo?.description}
              </div>
            </div>
          </div>
          <div className={`${style["profile-link"]}`}>
            <div className={`${style["profile-frame"]}`}>
              <TwitterEmbbed user={linkSns} />
              <div className={`${style["overlay"]}`}></div>
            </div>
            <Row justify="start" className={`${style["profile-sns"]}`}>
              {mediaLinksComponent}
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};
