import style from "./cart.module.scss";
import { useTranslation } from "next-i18next";
import { CartItem } from "@components/cart-item/CartItem";
import { Checkbox, Button } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CustomerCartAPI from "../../api/customer/cart";
import { GetUserInfo } from "src/api/auth";
// import { RequireLoginModal } from "@components/modal/RequireLoginModal";
import { useDispatch, useSelector } from 'react-redux';

export const CartTemplate = ({ cartList, getCartList, isAllChecked, getCartListGuest }) => {
  const router = useRouter();
  // const isCheckoutPending = useSelector((state: any) => {
  //   return state.cart.isCheckoutPending;
  // });

  const { t } = useTranslation();

  const [isLogged, setIsLogged] = useState(false);
  // const [isLoading, setLoading] = useState(isCheckoutPending);

  const dispatch = useDispatch();

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

  // useEffect(() => {
  //   setLoading(isCheckoutPending)
  // }, [isCheckoutPending])

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
      // if (cart.isCheck) {
      tmpTotalPrice += parseInt(cart.price);
      tmpTotalChecked += 1;
      // }
    });
    setTotalPrice(tmpTotalPrice);
    setNumberCheckedItem(tmpTotalChecked);
  }, [cartList, isAllChecked]);

  // const toogleIsCheckCart = (cartItem) => {
  //   const userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
  //   if(userInfo) {
  //     CustomerCartAPI.toogleIsCheckCart({ userInfo, cartItem }).then((res) => {
  //       if (res.cartItems) {
  //         getCartList();
  //       }
  //     });
  //   }
  //   else {
  //     const newCartList = cartList.map(cart => {
  //       return {
  //         ...cart,
  //         isCheck: isAllChecked ? false : true,
  //       }
  //     })
  //     dispatch({
  //       type: 'UPDATE_CART',
  //       payload: newCartList,
  //     });
  //     getCartListGuest(newCartList)
  //   }
  // };

  return (
    <>
      <div style={{ height: 50 }} />

      <div className={`${style["cart"]}`}>
        <div className={`${style["cart-header"]}`}>
          {t("common:cartItem.shoppingCart")}
        </div>

        <div className={`${style["cart-item-list"]}`}>
          {/* <div className={`${style["check-box"]}`}> */}
          {/* <Checkbox */}
          {/* checked={isAllChecked}
            // onClick={() => toogleIsCheckCart("all")}
            // />
            // <span className={`${style["select-all"]}`}>
            //   {t("common:cartItem.selectAll")} ({cartList.length})
            // </span> */}
          {/* </div> */}
          <hr className={`${style["line-1"]}`} />
          {cartList.map(
            (itemInfo, index) => {
              console.log({ itemInfo })
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
        // loading={isLoading}
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
