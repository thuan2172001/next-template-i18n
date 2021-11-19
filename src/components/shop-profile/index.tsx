import React, { useRef, useState, useEffect } from "react";
import { TwitterEmbbed } from "@components/twitter-homepage";
import { Modal, Input, Button, Row, Col } from "antd";
import { cnumberWithCommas } from "src/utils/common-function";
import { GetUserInfo } from "src/api/auth";
import style from "./shop-profile.module.scss";
import { useTranslation } from "react-i18next";

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
    "Chiều về là lúc bến sông quê tôi tấp nập nhất. Đoàn thuyền chở các bà, các chị từ chợ huyện, chợ tỉnh về cập bến. Các bà các chị được đàn con ùa ra đón. Con lớn đỡ cho mẹ gánh hàng. Con nhỏ vòi mẹ chia quà. Tiếng cười nói rộn ràng cả một khúc sông. Rồi ai về nhà nây. Con thuyền neo vào bến đỗ. Đây cũng là lúc bọn trẻ chăn trâu lùa trâu xuống tắm. Bọn trẻ tắm cho trâu, rồi bọn trẻ giỡn nước. Chúng té nước cho nhau. Chúng chơi trò đánh trận. Một đứa kiếm đâu được trái bóng tròn. Thế là chúng ném bóng cho nhau. Một ý kiến được cả bọn chấp nhận: chơi bóng nước. Chúng chia làm hai phe, chuyền bóng cho nhau. Phe nào chuyền được 6 chuyền là thắng. Phe thua phải cõng phe thắng chạy dọc con sông suốt từ bến tắm đến tận gốc đa. Bến sông quê tôi cứ rộn ràng như vậy cho đến lúc mặt trời lặn phía chân ười mới có chút bình lặng. Dưới chân Tháp Bà Ponaga, dòng sông Cái hiền hoà chảy ra biển. Hai bên bờ sông, nhà cửa lô nhô. Lác đác, vài cụm dừa mọc choài ra sông, tàu lá lao xao trong gió. Giữa sông, cù lao Hải Đảo rợp bóng dừa như một ốc đảo xanh lục giữa làn nước xanh lam. Cầu Bóng bắc qua sông nườm nượp xe cộ. Dưới chân cầu, nơi con sông đổ ra biển là cầu Cá. Thuyền đi biển sơn hai màu xanh đỏ, đậu san sát gần một mỏm đá nối lên như hòn non bộ. Vài chiếc tàu máy chạy trên sông. Tiếng còi ô tô gay gắt lẫn tiếng ghe máy chạy ì ầm làm dòng sông ồn ã lên. Nắng trưa bàng bạc lên dòng sông, mặt nước sông như dát một thứ ánh kim xanh biếc màu trời. Con sông, cửa biển và bến thuyền gắn bó bao đời là một trong những cảnh đẹp của thành phố Nha Trang được nhiều người biết đến.",
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
  const [follower, setFollower] = useState(19527123);
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

  const onClickFollow = () => {
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
                        {t('common:authorDefault.name')}

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

    </div>
  );
};
