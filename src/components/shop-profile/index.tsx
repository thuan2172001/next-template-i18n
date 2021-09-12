import React, { useRef, useState, useEffect } from "react";
import { TwitterEmbbed } from "@components/twitter-homepage";
import { Modal, Input, Button, Row, Col } from "antd";
import { cnumberWithCommas } from "src/utils/common-function";
// import CreatorSettingAPI from "../../api/creator/setting";
import { GetUserInfo } from "src/api/user";
// import CreatorManagementApi from "../../api/creator/creators-management";
// import { RequireLoginModal } from "@components/modal/RequireLoginModal";

import style from "./shop-profile.module.scss";
import { BASE_URL } from "../../api/const";
import { useTranslation } from "react-i18next";

const { TextArea } = Input;

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

const authorData = {
  name: "前沢雅彦",
  alphabetName: "MAESAWA MASAHIKO",
  mediaLinks: [
    "https://www.facebook.com/Arsenal",
    "https://www.instagram.com/byark.bp/",
    "https://twitter.com/billgates",
    "https://www.youtube.com/channel/UCiZJtnTQunvoY0xgv-Ce_rg",
    "https://www.pinterest.com/marvel/_created/",
  ],
  introduction:
    "コンシューマー・ゲームソフトのアートディレクター、ムービーディレクターを経て、フリーランス。プリプロダクション業務とオリジナル・ストーリーコンテンツ制作に特化した、株式会社・ユーフォーピクチャーズを設立。主に、CGアニメーションやTVアニメーションの企画・シリーズ構成・脚本・絵コンテ・キャラクターデザイン・監督などを担当。コンシューマー・ゲームソフトのアートディレクター、ムービーディレクターを経て、フリーランス。プリプロダクション業務とオリジナル・ストーリーコンテンツ制作に特化した、株式会社・ユーフォーピクチャーズを設立。主に、CGアニメーションやTVアニメーションの企画・シリーズ構成・脚本・絵コンテ・キャラクターデザイン・監督などを担当。コンシューマー・ゲームソフトのアートディレクター、ムービーディレクターを経て、フリーラコンシューマー・ゲームソフトのアートディレクター、ムービーディレクターを経て、フリーランス。プリプロダクション業務とオリジナル・ストーリーコンテンツ制作に特化した、株式会社・ユーフォーピクチャーズを設立。主に、CGアニメーションやTVアニメーションの企画・シリーズ構成・脚本・絵コンテ・キャラクターデザイン・監督などを担当。コンシューマー・ゲームソフトのアートディレクター、ムービーディレクターを経て、フリーランス。プリプロダクション業務とオリジナル・ストーリーコンテンツ制作に特化した、株式会社・ユーフォーピクチャーズを設立。主に、CGアニメーションやTVアニメーションの企画・シリーズ構成・脚本・絵コンテ・キャラクターデザイン・監督などを担当。コンシューマー・ゲームソフトのアートディレクター、ムービーディレクターを経て、フリーランス。プリプロダクション業務とオリジナル・ストーリーコンテンツ制作に特化した、株式会社・ユーフォーピクチャーズを設立。主に、CGアニメーションやTVアニメーションの企画・シリーズ構成・脚本・絵コンテ・キャラクターデザイン・監督などを担当。・ストーリーコンテンツ制作に特化した、株式会社・ユーフォーピクチャーズを設立。主に、CGアニメーションやTVアニメーションの企画・シリーズ構成・脚本・絵コンテ・キャラクターデザイン・監督などを担当。コンシューマー・ゲームソフトのアートディレクター、ムービーディレクターを経て、フリーランス。プリプロダクション業務とオリジナル・ストーリーコンテンツ制作に特化した、株式会社・ユーフォーピクチャーズを設立。主に、CGアニメーションやTVアニメーションの企画・シリーズ構成・脚本・絵コンテ・キャラクターデザイン・監督などを担当。コンシューマー・ゲームソフトのアートディレクター、ムービーディレクターを経て、フリーランス。プリプロダクション業務とオリジナル・ストーリーコンテンツ制作に特化した、株式会社・ユーフォーピクチャーズを設立。主に、CGアニメーションやTVアニメーションの企画・シリーズ構成・脚本・絵コンテ・キャラクターデザイン・監督などを担当。ンス。プリプロダクション業務とオリジナル・ストーリーコンテンツ制作に特化した、株式会社・ユーフォーピクチャーズを設立。主に、CGアニメーションやTVアニメーションの企画・シリーズ構成・脚本・絵コンテ・キャラクターデザイン・監督などを担当。",
};

const SocialMediaItem = ({ mediaLink, index }) => {
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

export const ShopProfile = ({ template }) => {
  let userInfo = GetUserInfo();
  const { t } = useTranslation();
  const [follower, setFollower] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [creatorInfo, setCreatorInfo] = useState(authorData);
  const [linkSns, setLinhSNS] = useState(authorData.mediaLinks);
  const [mediaLinks, setMediaLinks] = useState<any>();

  useEffect(() => {
    linkSns &&
      setMediaLinks(
        linkSns.map((mediaLink, i) => (
          <div style={{ width: "20%" }} key={i}>
            <SocialMediaItem mediaLink={mediaLink} index={i} />
          </div>
        ))
      );
  }, [linkSns]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      userInfo =
        window.localStorage && window.localStorage.getItem("userInfo")
          ? JSON.parse(window.localStorage.getItem("userInfo"))
          : {};
    }
  }, [userInfo]);

  // useEffect(() => {
  // CreatorSettingAPI.getCreatorInfo({
  //   userInfo: GetUserInfo(),
  //   creator: creatorId
  // }).then(res => {
  //   setCreatorInfo(res);
  //   setFollower(res.totalFollower)
  //   setIsFollowing(res.isFollowing)
  //   setLinhSNS(res.mediaLinks)
  // })
  // }, [creatorId])

  const onClickFollow = () => {
    // if (!isLogged) setModalVisible(true);
    // else {
    // CreatorManagementApi.toggleFollowCreator({userInfo: GetUserInfo(), creator: creatorId}).then((res) => {
    //   if(res.success) {
    //     setIsFollowing(res.isFollowing);
    //     setFollower(res.totalFollower);
    //   }
    // })
    // }
  };

  return (
    <div className={`${style["profile-container"]}`}>
      <div className={`${style["profile-title"]}`}>{t("common:topPage.profile")}</div>
      {template == 1 && (
        <>
          <div className={`${style["all-box"]}`}>
            <div className={`${style["profile-main"]}`}>
              <div className={`${style["profile-info"]}`}>
                <div className={`${style["box"]}`}>
                  <div className={`${style["top"]}`}>
                    <img src={"assets/demo/demo-author.svg"}></img>
                    <div className={`${style["creator-info"]}`}>
                      <div className={`${style["creator-name"]}`}>
                        {"Trinh Van Thuan"}
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
                          {cnumberWithCommas(19527123)}{" "}
                          {follower > 1 ? "followers" : "follower"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={`${style["introduction"]}`}>
                    {creatorInfo?.introduction}
                  </div>
                </div>
              </div>
              <div className={`${style["profile-link"]}`}>
                <div className={`${style["profile-frame"]}`}>
                  <TwitterEmbbed />
                  <div className={`${style["overlay"]}`}></div>
                </div>
                <Row justify="start" className={`${style["profile-sns"]}`}>
                  {mediaLinks}
                </Row>
              </div>
            </div>
          </div>
        </>
      )}
      {/* {modalVisible && (
        <RequireLoginModal
          updateModalVisible={() => setModalVisible(false)}
        />
      )} */}
    </div>
  );
};
