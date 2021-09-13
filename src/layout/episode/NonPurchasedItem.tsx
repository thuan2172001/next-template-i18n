import { Col, Row, Button } from "antd";
import React from "react";
import { useTranslation } from "next-i18next";
import style from "./episode.module.scss";
import CounterInput from "react-counter-input";
import { useRouter } from "next/router";

export const NonPurchasedItem = ({ episodeInfo = null, setCartAmount = null, addedToBookshelf = null, handelAddToBookshelf = null, handleAddToCart = null, serieId = null }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const enjoyEpisode = ({ serieId, episodeId, type }) => {
    if(type == 'watch')
      router.push(`watch?serieId=${serieId}&episodeId=${episodeId}`);
    else router.push(`read?serieId=${serieId}&episodeId=${episodeId}`);
  };

  return (
    <>
      <Row>
        <Col xs={24}>
          {episodeInfo?.price == "0" ? (
            <div className={`${style["free"]}`}>{t("common:free")}</div>
          ) : (
              <div className={`${style["price"]}`}>
                <span>
                  {episodeInfo?.price} USD
                </span>
              </div>
          )}
        </Col>
      </Row>

      {episodeInfo?.price == "0" ? (
        <Row gutter={15} className={`${style["available"]}`}>
          <>
            <Col span={12}>
              <Button
                disabled={addedToBookshelf}
                className={
                  !addedToBookshelf
                    ? `${style["available"]} ${style["btn-add-to-cart"]}`
                    : `${style["sold-out"]} ${style["btn-add-to-bookshelf"]}`
                }
                onClick={handelAddToBookshelf}
              >
                {addedToBookshelf
                  ? t("common:nft.addedToBookshelf")
                  : t("common:nft.addToBookshelf")}
              </Button>
            </Col>
            <Col span={12}>
              <Button
                className={`${style["available"]} ${style["btn-buy-now"]}`}
                onClick={() => {}}
              >
                {t("common:enjoy")}
              </Button>
            </Col>{" "}
          </>
        </Row>
      ) : (
        <Row
          gutter={15}
          className={`${style["available"]}`}
        >
          <>
            <Col span={12}>
              <Button
                className={
                  `${style["available"]} ${style["btn-add-to-cart"]}`}
                onClick={() => {}}
                // disabled={episodeInfo?.forSaleEdition == 0}
              >
                {t("common:addToCart")}
              </Button>
            </Col>
            <Col span={12}>
              <Button
                onClick={() => {
                    // handleAddToCart();
                    router.push("/user/cart");

                }}
                className={`${style["available"]} ${style["btn-buy-now"]}`}
              >
                {t("common:buyNow")}
              </Button>
            </Col>
          </>
        </Row>
      )}
    </>
  );
};