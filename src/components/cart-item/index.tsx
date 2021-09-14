import React from "react";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import style from "./cart-item.module.scss";

const CartItem = ({ itemInfo, updateQuantity, type = "" }) => {
  const { srcImg, itemName, numberEdition, price, cartItemId, creatorName } =
    itemInfo;

  const [currentNumberOfEdition, setCurrentNumberOfEdition] = React.useState(
    numberEdition > 1 ? numberEdition : 1
  );

  const { t } = useTranslation();

  let isCheckingOut = type === "checkout";

  return (
    <div className={style["cart-item-container"]}>
      {isCheckingOut ? (
        <div className={`${style["cart-item"]}`}>
          <div className={`${style["cart-item-image"]}`}>
            {srcImg && <Image src={srcImg} width={95} height={95} />}
          </div>

          <div className={`${style["cart-item-name"]}`}>
            {itemName ? itemName : ""}
            <div className={`${style["cart-item-creator"]}`}>
              {creatorName ? creatorName : ""}
            </div>
          </div>

          <div
            className={`${style["cart-item-price"]} ${style["unit"]}`}
            style={{ padding: 0 }}
          >
            {typeof price === "number" && (price + " JPY")}
          </div>

          <div className={`${style["edition-count-1"]}`}>{numberEdition}</div>
          <div className={`${style["cart-item-price"]}`} style={{ padding: 0 }}>
            {typeof price === "number" &&
              ((price * currentNumberOfEdition) + " JPY")}
               
          </div>
        </div>
      ) : (
        <div className={`${style["cart-item"]}`}>
          <div className={`${style["cart-item-image"]}`}>
            {srcImg && <Image src={srcImg} width={95} height={95} />}
          </div>

          <div className={`${style["cart-item-name"]}`}>
            {itemName ? itemName : ""}
          </div>

          <div className={`${style["cart-item-price"]} ${style["unit"]}`}>
            ${typeof price === "number" && (price + " JPY")}
          </div>

          <div
            className={`${style["edition-count"]}`}
            style={{ display: "flex", maxHeight: "32px" }}
          >
          </div>
          <div className={`${style["cart-item-price total-price"]}`}>
            $
            {typeof price === "number" &&
              ((price * currentNumberOfEdition) + " JPY")}
          </div>
          <div
            className={`${style["remove-item"]}`}
            onClick={() => {
              updateQuantity({ cartItemId, count: 0 });
            }}
          >
            {t("common:remove")}
          </div>
        </div>
      )}
    
    </div>
  );
};

export default CartItem;
