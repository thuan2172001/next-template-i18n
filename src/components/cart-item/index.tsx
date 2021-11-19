import React from "react";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import style from "./cart-item.module.scss";

const CartItem = ({ itemInfo, type = "" }) => {
  const { thumbnail, name, price, episodeId } =
    itemInfo;

  const { t } = useTranslation();

  let isCheckingOut = type === "checkout";

  return (
    <div className={style["cart-item-container"]}>
      {isCheckingOut ? (
        <div className={`${style["cart-item"]}`}>
          <div className={`${style["cart-item-image"]}`}>
            {thumbnail && <Image src={thumbnail} width={95} height={95} />}
          </div>

          <div className={`${style["cart-item-name"]}`}>
            {name ? name : ""}
          </div>

          <div
            className={`${style["cart-item-price"]} ${style["unit"]}`}
            style={{ padding: 0 }}
          >
            {typeof price === "number" && (price + " USD")}
          </div>

          <div className={`${style["cart-item-price"]}`} style={{ padding: 0 }}>
            {price + " USD"}
               
          </div>
        </div>
      ) : (
        <div className={`${style["cart-item"]}`}>
          <div className={`${style["cart-item-image"]}`}>
            {thumbnail && <Image src={thumbnail} width={95} height={95} />}
          </div>

          <div className={`${style["cart-item-name"]}`}>
            {name ? name : ""}
          </div>

          <div className={`${style["cart-item-price"]} ${style["unit"]}`}>
            ${typeof price === "number" && (price + " USD")}
          </div>

          <div
            className={`${style["edition-count"]}`}
            style={{ display: "flex", maxHeight: "32px" }}
          >
          </div>
          <div className={`${style["cart-item-price total-price"]}`}>
            $
            {price + " USD"}
          </div>
          <div
            className={`${style["remove-item"]}`}
            onClick={() => {}}
          >
            {t("common:remove")}
          </div>
        </div>
      )}
    
    </div>
  );
};

export default CartItem;
