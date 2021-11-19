import style from "./cart.module.scss";
import { useTranslation } from "next-i18next";
import { CartItem } from "@components/cart-item/CartItem";
import { Checkbox, Button } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GetUserInfo } from "src/api/auth";
import { useDispatch, useSelector } from 'react-redux';
import Head from "next/head";

export const CartTemplate = ({ cartList, getCartList, isAllChecked, getCartListGuest }) => {
  const router = useRouter();
  const { t } = useTranslation();

  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userInfo = GetUserInfo()

      if (userInfo["encryptedPrivateKey"] && userInfo["publicKey"]) {
        setIsLogged(true);
      } else {
        setIsLogged(false);
      }
    }
  }, []);

  const [modalVisible, setModalVisible] = useState(false);

  const handleCheckout = () => {
    if (isLogged) router.push("/user/checkout");
    else {
      setModalVisible(true);
    }
  }

  const [totalPrice, setTotalPrice] = useState(0);
  const [numberCheckedItem, setNumberCheckedItem] = useState(0);

  useEffect(() => {
    let tmpTotalPrice = 0;
    let tmpTotalChecked = 0;
    cartList.forEach((cart) => {
      tmpTotalPrice += parseInt(cart.price);
      tmpTotalChecked += 1;
    });
    setTotalPrice(tmpTotalPrice);
    setNumberCheckedItem(tmpTotalChecked);
  }, [cartList, isAllChecked]);

  return (
    <>
      <div style={{ height: 50 }} />

      <div className={`${style["cart"]}`}>
        <div className={`${style["cart-header"]}`}>
          {t("common:cartItem.shoppingCart")}
        </div>

        <div className={`${style["cart-item-list"]}`}>
          <hr className={`${style["line-1"]}`} />
          {cartList.map(
            (itemInfo, index) => {
              if (itemInfo) return (
                <div key={index}>
                  <CartItem itemInfo={itemInfo} getCartList={getCartList} getCartListGuest={getCartListGuest} />
                  {index < cartList.length - 1 && (
                    <hr className={`${style["line"]}`} />
                  )}
                </div>
              )
            }
          )}
        </div>

        <div className={`${style["order-total"]}`}>
          <span className={`${style["order-total-name"]}`}>
            {t("common:cartItem.orderTotal")} {' '}
            ({numberCheckedItem} {t("common:cartItem.item")}
            {numberCheckedItem > 1 && "s"}):
          </span>
          <span className={`${style["order-total-number"]}`}>
            {totalPrice} USD
          </span>
        </div>

        <Button
          className={`${style["checkout-cart"]}`}
          onClick={handleCheckout}
          disabled={numberCheckedItem === 0}
        >
          {t("common:cartItem.proceedCheckout")}
        </Button>

        <div
          className={`${style["continue-browse"]}`}
          onClick={() => router.push("/")}
        >
          {t("common:cartItem.continueBrowse")}
        </div>
      </div>
    </>
  );
};
