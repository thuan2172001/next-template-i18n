import { Col, Row, Skeleton, Button } from "antd";
import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { HeartFilled } from "@ant-design/icons";
// import SeriesAPI from "../../../../api/creator/series";
import { GetUserInfo } from "../../../../api/auth";
import { useRouter } from "next/router";
// import { ShareModal } from "@components/share-modal";
import { RequireLoginModal } from "@components/modal/RequireLoginModal";
import { NonPurchasedItem } from "../../../episode/NonPurchasedItem";
import { PurchasedItem } from "../../../episode/PurchasedItem";
import { CreateNftModal } from "../CreateNftModal";
import style from "../../../episode/episode.module.scss";

export const NFTPreview = ({ data, setVisible, upLoad, isLoading, pending }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { serie } = router.query;
  const [shareModal, setShareModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  let userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
  const [isPurchasedItem, setIsPurchased] = useState(false);
  const [amount, setAmount] = useState(1);
  const [episodeInfo, setEpisodeInfo] = useState<any>({
    price: data.isFree ? 0 : "?",
    currency: "JPY",
    totalLikes: 1,
    total: data?.numberOfEdition?.num,
    totalEdition: data?.numberOfEdition?.num,
    forSale: 1,
    forSaleEdition: 1,
    numEditionInBookshelf: null,
    addedToBookshelf: false,
    isFavoriting: false,
    isFree: data.isFree ? true : false,
    owner: data?.seriesInfo?.createdBy?.user?.fullName,
    creatorAddress: "0xb6e85340E6000000000dF5551",
    contractID: "0xC6FDB39E59000000000A10990",
    created: new Date(),
    seriesName: data?.seriesInfo?.name,
  });
  const [addedToBookshelf, setAddedToBookshelf] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadContent, setUploadContent] = useState({
    title: {
      content: "",
      isEmpty: false,
      isValid: true,
    },
    description: {
      content: "",
      isValid: true,
    },
    type: "editions",
    numberOfEdition: {
      num: "",
      isEmpty: false,
      isValid: true,
    },
    file: {
      file: null,
      isEmpty: true,
      errMsg: "",
    },
    isFree: false,
    seriesInfo: null,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      userInfo =
        window.localStorage && window.localStorage.getItem("userInfo")
          ? JSON.parse(window.localStorage.getItem("userInfo"))
          : {};

      if (userInfo["encryptedPrivateKey"] && userInfo["publicKey"]) {
        setIsLogged(true);
      } else {
        setIsLogged(false);
      }
    }
  }, [userInfo]);

  return (
    <div className={`${style["container"]}`}>
      <div className={`${style["overlay"]}`}></div>
      <div className={`${style["nft"]} ${style["preview"]}`}>
        {/*<ShareModal*/}
        {/*  visible={shareModal}*/}
        {/*  setVisible={setShareModal}*/}
        {/*  content={episodeInfo?._id}*/}
        {/*  imageUrl={episodeInfo.thumbnail}*/}
        {/*/>*/}

        <Row gutter={30}>
          <Col span={12}>
            <div className="nft-image" style={{ position: "relative" }}>
              <img
                src={window.localStorage.getItem("thumbnail") || "ok"}
                className={`${style["thumbnail-image"]} ${style["cursor_pointer"]}`}
              />
            </div>
          </Col>

          <Col span={12}>
            <div className={style["product-detail"]}>
              <div className={style["name-container"]}>
                <Skeleton
                  active
                  paragraph={{ rows: 0 }}
                  loading={!data?.title?.content}
                >
                  <h2 className={style["nft-name"]}>{data?.title?.content}</h2>
                </Skeleton>
              </div>

              <div>
                <Skeleton
                  active
                  paragraph={{ rows: 0 }}
                  loading={!data?.seriesInfo}
                >
                  <a className={style["series-link"]}>
                    {data?.seriesInfo.serieName}
                  </a>
                </Skeleton>
              </div>

              <div className={style["category-row"]}>
                <span>
                  <HeartFilled
                    className={`${style["favorite-icon"]} ${style["color-red"]}`}
                  />
                </span>
                <span className={style["likes"]}>
                  {" "}
                  {episodeInfo.totalLikes}{" "}
                </span>

                <span>
                  <img
                    src={"/images/separate-line.svg"}
                    width={1}
                    height={22}
                  />
                </span>

                <span className={style["category-list"]}>
                  {
                    <span className={style["category-name"]}>
                      {
                        data?.seriesInfo.category.categoryName
                      }
                    </span>
                  }
                </span>
              </div>

              <div>
                <img
                  className={`${style["dotted-line"]}`}
                  src={"./images/dotted-line.svg"}
                  height={2}
                />
              </div>

              <Row>
                <Col xs={23}>
                  <a>
                    <img
                      src={data?.seriesInfo?.createdBy?.avatar || "ok"}
                      className={`${style["avatar-creator"]} ${style["cursor_pointer"]}`}
                    />
                  </a>
                  <span>
                    <a className={style["creator-name"]}>
                      {data?.seriesInfo?.createdBy?.user?.fullName || "Tac gia"}
                    </a>
                  </span>
                </Col>
                <Col xs={1}>
                  <img
                    src={"/assets/icons/share/share-link.svg"}
                    className={`${style["share-btn"]} ${style["cursor_pointer"]}`}
                  />
                </Col>
              </Row>
              {isPurchasedItem ? (
                <PurchasedItem
                  episodeInfo={episodeInfo}
                  // handleBuyMoreEdition={() => setIsPurchased(false)}
                />
              ) : (
                <NonPurchasedItem
                  episodeInfo={episodeInfo}
                  addedToBookshelf={addedToBookshelf}
                  handelAddToBookshelf={() => console.log("Add")}
                  // setCartAmount={({ count }) => {
                  //   setAmount(count);
                  // }}
                  handleAddToCart={() => console.log("Add")}
                />
              )}
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={24} className={`${style["description"]}`}>
            <Skeleton
              active
              loading={
                data?.description?.content !== "" && !data?.description?.content
              }
            >
              {data?.description?.content}
            </Skeleton>
          </Col>
        </Row>

        {modalVisible && (
          <RequireLoginModal
            updateModalVisible={() => setModalVisible(false)}
            isFrom={`/episode?serieId=`}
          />
        )}
        {confirmModal && !pending && (
          <CreateNftModal
            updateModalVisible={setConfirmModal}
            upLoad={upLoad}
            isLoading={isLoading}
          />
        )}
      </div>
      <div className={`${style["border"]}`}>
        <Button
          onClick={() => setVisible(false)}
          className={`${style["bottom-btn"]}`}
        >
          {t("create-series:createNft.continueEditing")}
        </Button>
        <Button
          onClick={() => setConfirmModal(true)}
          className={`${style["bottom-btn"]} ${style["active-btn"]}`}
        >
          {t("create-series:createNft.creatItem")}
        </Button>
      </div>
    </div>
  );
};
