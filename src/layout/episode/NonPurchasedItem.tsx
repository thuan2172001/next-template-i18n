import { Col, Row, Button } from "antd";
import React from "react";
import { useTranslation } from "next-i18next";
import style from "./episode.module.scss";
import { useRouter } from "next/router";
import { GetUserInfo } from "src/api/auth";

export const NonPurchasedItem = ({ episodeInfo = null, amountInCart = 0, addedToBookshelf = null, handelAddToBookshelf = null, handleAddToCart = null, serieId = null }) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <>
      <Row>
        <Col xs={24}>
          {episodeInfo?.price == 0 ? (
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

      {episodeInfo?.price == 0 ? (
        <Row gutter={15} className={`${style["available"]}`}>
          <>
            <Col span={11}>
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
                  ? t("common:episode.addedToBookshelf")
                  : t("common:episode.addToBookshelf")}
              </Button>
            </Col>
            <Col span={2} />
            <Col span={11}>
              <Button
                className={`${style["available"]} ${style["btn-buy-now"]}`}
                onClick={() => { }}
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
            <Col span={11}>
              <Button
                className={
                  amountInCart < 1
                    ? `${style["available"]} ${style["btn-add-to-cart"]}`
                    : `${style["sold-out"]} ${style["btn-add-to-cart"]}`}
                disabled={amountInCart > 0}
                onClick={() => handleAddToCart()}
              >
                {t("common:addToCart")}
              </Button>
            </Col>
            <Col span={2}></Col>
            <Col span={11}>
              <Button
                onClick={() => {
                  const userInfo = GetUserInfo();
                  handleAddToCart();
                  if (userInfo["encryptedPrivateKey"] && userInfo["publicKey"]) {
                    router.push("/user/cart");
                  } else {
                    router.push("/login");
                  }
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
