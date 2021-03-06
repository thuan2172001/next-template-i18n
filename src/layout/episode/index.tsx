import { Col, Row, Skeleton, Button } from "antd";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "next-i18next";
import CustomImageField from "@components/image";
import style from "./episode.module.scss";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import CustomerEpisodeAPI from "../../api/customer/episode";
import CustomerCartAPI from "../../api/customer/cart";
import CustomerBookshelfAPI from "../../api/customer/bookshelf";
import { GetUserInfo } from "../../api/auth";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { NonPurchasedItem } from "./NonPurchasedItem";
import EpisodeManagementAPI from "../../api/episode-management/episode-management";
import { PurchasedItem } from "./PurchasedItem";
import { RequireLoginModal } from "@components/modal/RequireLoginModal";
import Share from "@components/share-component/share";
import Slider from "react-slick";
import { EpisodeProduct } from "@components/product-item/EpisodeProduct";
import Head from "next/head";
import { PublicItem } from "./PublicItem";
import { PrivateItem } from "./PrivateItem";

const EpisodeTemplate = ({ seriesId, episodeId, isCreatorMode }) => {
  let userInfo = JSON.parse(window.localStorage.getItem("userInfo"));

  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const cartList = useSelector((state: any) => state.cart?.cartList);
  const [favorite, setFavorite] = useState(false);
  const [amountInCart, setAmountInCart] = useState(0);
  const [episodeInfo, setEpisodeInfo] = useState<any>({});
  const [episodeTotalLikes, setTotalLikes] = useState(0);
  const [isLogged, setIsLogged] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [addedToBookshelf, setAddedToBookshelf] = useState(false);
  const [itemSlider, setItemSlider] = useState(Math.floor((window.innerWidth - window.innerHeight * 30 / 100) / 180));
  const [publishInPrivatSerie, setPublishInPrivateSerie] = useState(false);

  useEffect(() => {
    const updateWindowDimensions = () => {
      const items = Math.floor((window.innerWidth - window.innerHeight * 30 / 100) / 180);
      setItemSlider(items);
    };
    window.addEventListener("resize", updateWindowDimensions);
    return () => window.removeEventListener("resize", updateWindowDimensions)
  }, [])

  const moveToSeriePage = () => {
    const pathname = "/serie/" + seriesId;
    router.push(pathname);
  };

  const addToBookshelf = () => {
    if (!isLogged) setModalVisible(true);
    else {
      CustomerBookshelfAPI.addFreeEpToBookshelf({
        userInfo: GetUserInfo(),
        episodeId,
      })
        .then(() => {
          setAddedToBookshelf(true);
        })
        .catch();
    }
  };

  const onClickFavorite = () => {
    favorite ?
      EpisodeManagementAPI.unlike({
        userInfo: GetUserInfo(),
        episodeId: episodeId,
      }).then((res) => {
        if (res.data == "success") {
          setFavorite(false);
          setTotalLikes(episodeTotalLikes - 1);
        }
      }) : EpisodeManagementAPI.like({
        userInfo: GetUserInfo(),
        episodeId: episodeId,
      }).then((res) => {
        if (res.data == "success") {
          setFavorite(true);
          setTotalLikes(episodeTotalLikes + 1);
        }
      })
  };

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

  useEffect(() => {
    fetchData();
  }, [episodeId]);

  const fetchData = () => {
    if (episodeId) {
      CustomerEpisodeAPI.getEpisodeInfo({
        userInfo: GetUserInfo(),
        episodeId: episodeId,
      }).then((response) => {
        const episode = response.data || response;
        setEpisodeInfo({
          ...episode,
        });
        setFavorite(episode?.alreadyLiked);
        setTotalLikes(episode?.likes);
        setAmountInCart(0);
      });
    }
  };

  const getCartList = () => {
    const userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    CustomerCartAPI.getCart({ userInfo }).then((data) => {
      if (data) {
        dispatch({
          type: "UPDATE_CART",
          payload: data,
        });
        data.forEach((_episodeId) => {
          if (_episodeId === episodeId)
            setAmountInCart(1);
        });
      }
    });
  };

  const handleAddToCart = () => {
    let newCartList = [];
    if (cartList) {
      newCartList = [...new Set([...cartList, episodeInfo.episodeId])];
    } else newCartList = [episodeInfo.episodeId]
    const userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    if (userInfo) {
      CustomerCartAPI.updateCart({
        userInfo,
        cartItems: newCartList,
      }).then(() => {
        getCartList();
      });
    } else {
      dispatch({
        type: "UPDATE_CART",
        payload: newCartList,
      });
      setAmountInCart(1);
    }
  };

  return (
    <div className={style.nft}>
      <Head>
        <title>WebtoonZ | {episodeInfo?.name}</title> //Todo
      </Head>
      {isCreatorMode && publishInPrivatSerie && (
        <div className={`${style["error-msg"]}`}>
          <img src="/assets/icons/invalid.svg" height={24} width={24} />
          <div className={`${style["error-content"]}`}>
            Please publish the series before publish this item.
          </div>
        </div>
      )}
      <Row gutter={30}>
        <Col span={12}>
          <Skeleton active loading={!episodeInfo?.thumbnail}>
            <div className="nft-image" style={{ position: "relative" }}>
              <CustomImageField
                width={"454"}
                height={"454"}
                src={episodeInfo.thumbnail}
                alt="nft"
                isNewRelease={false}
                borderSize="bold"
                isPublished={true}
                isSoldOut={false}
              />
            </div>
          </Skeleton>
        </Col>

        <Col span={12}>
          <div className={style["product-detail"]}>
            <div className={style["name-container"]}>
              <Skeleton
                active
                paragraph={{ rows: 0 }}
                loading={!episodeInfo?.name}
              >
                <h2 className={style["nft-name"]}>{episodeInfo?.name}</h2>
              </Skeleton>
            </div>

            <div>
              <Skeleton
                active
                paragraph={{ rows: 0 }}
                loading={!episodeInfo?.serie}
              >
                <h3
                  className={`${style["series-link"]} ${style["cursor_pointer"]
                    }`}
                  onClick={moveToSeriePage}
                >
                  {episodeInfo?.serie?.serieName}
                </h3>
              </Skeleton>
            </div>

            <div className={style["category-row"]}>
              <span>
                {favorite ? (
                  <HeartFilled
                    className={`${style["favorite-icon"]} ${style["color-red"]}`}
                    onClick={onClickFavorite}
                  />
                ) : (
                  <HeartOutlined
                    className={`${style["favorite-icon"]}`}
                    onClick={onClickFavorite}
                  />
                )}
              </span>
              <span className={style["likes"]}>
                {" "}
                {episodeTotalLikes}{" "}
              </span>

              <span>
                <img src={"/assets/icons/separate-line.svg"} width={1} height={22} />
              </span>

              <Skeleton
                loading={!episodeInfo?.category?.categoryName}
              >
                <span className={style["category-list"]}>
                  <span className={style["category-name"]}>
                    {t(`common:category.${episodeInfo?.category?.categoryName}`)}
                  </span>
                </span>
              </Skeleton>
            </div>

            <div>
              <img
                className={`${style["dotted-line"]}`}
                src={"/assets/icons/dotted-line.svg"}
                height={2}
              />
            </div>

            <Row>
              <Share episodeId={episodeId} thumbnail={episodeInfo?.thumbnail} />
            </Row>
            {!isCreatorMode && <>
              {episodeInfo.isBought ? <PurchasedItem
                episodeInfo={episodeInfo}
                serieId={seriesId}
              /> : <NonPurchasedItem
                serieId={seriesId}
                episodeInfo={episodeInfo}
                amountInCart={amountInCart}
                addedToBookshelf={addedToBookshelf}
                handelAddToBookshelf={() => {
                  addToBookshelf()
                }}
                handleAddToCart={handleAddToCart}
              />}
            </>}
          </div>

          <div>
            {isCreatorMode && episodeInfo?.isPublished && (
              <PublicItem episodeInfo={episodeInfo} />
            )}
            {isCreatorMode && !episodeInfo?.isPublished && (
              <PrivateItem
                episodeInfo={episodeInfo}
                updatePublishInPrivateSerie={() =>
                  setPublishInPrivateSerie(true)
                }
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
              episodeInfo?.description !== "" && !episodeInfo?.description
            }
          >
            {episodeInfo?.description}
          </Skeleton>
        </Col>
      </Row>

      {modalVisible && (
        <RequireLoginModal
          updateModalVisible={() => setModalVisible(false)}
          isFrom={router.asPath}
        />
      )}

      <div className={`${style["slide"]}`}>
        <div className={`${style["similar-items"]}`}>{t("common:similarItem")}</div>
        <Slider
          infinite={true}
          nextArrow={<div><img id={`${style["slide-next-icon"]}`} src="/assets/icons/next-icon.svg" /></div>}
          prevArrow={<div><img id={`${style["slide-prev-icon"]}`} src="/assets/icons/prev-icon.svg" /></div>}
          slidesPerRow={itemSlider}
          rows={1}
        >
          {episodeInfo?.similarEpisodes?.map((ep) => {
            return (
              <div className={`${style["slide-component"]}`}>
                <EpisodeProduct
                  serieId={seriesId}
                  episode={ep}
                />
              </div>
            )
          })}
        </Slider>
      </div>

    </div>
  );
};

export default EpisodeTemplate;
