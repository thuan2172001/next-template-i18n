import { useTranslation } from "next-i18next";
import { useState } from "react";
import Image from "next/image";
import style from "./item.module.scss";
import { Checkbox } from "antd";
import CustomerCartAPI from "../../api/customer/cart";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import CustomerSerieAPI from "../../api/customer/serie";
import { useEffect } from "react";

export const CartItem = ({
  itemInfo,
  getCartList,
  cartList,
  getCartListGuest,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();

  const { thumbnail, price, serieId, episodeId, name } = itemInfo;
  const [authorId, setAuthorId] = useState("");

  // const toogleIsCheckCart = (cartItem) => {
  //   const userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
  //   if (userInfo) {
  //     CustomerCartAPI.toogleIsCheckCart({ userInfo, cartItem }).then((res) => {
  //       if (res.cartItems) {
  //         getCartList();
  //       }
  //     });
  //   } else {
  //     const newCartList = cartList.map((cart) => {
  //       if (cart.episode._id === episode._id || cart.episode === episode._id) {
  //         return {
  //           ...cart,
  //           isCheck: !cart.isCheck,
  //         };
  //       }
  //       return cart;
  //     });

  //     dispatch({
  //       type: "UPDATE_CART",
  //       payload: newCartList,
  //     });
  //     getCartListGuest(newCartList);
  //   }
  // };

  // const updateQuantity = (quantity) => {
  //   if (quantity === itemInfo.quantity) return;
  //   const userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
  //   if (userInfo) {
  //     CustomerCartAPI.updateCart({
  //       userInfo,
  //       cartItems: []
  //     }).then(() => {
  //       getCartList();
  //     });
  //   } else {
  //     let newCartList = cartList.map((cart) => {
  //       if (cart.episode._id === episode._id || cart.episode === episode._id) {
  //         return {
  //           ...cart,
  //           quantity: quantity > maxNumberCanBuy ? maxNumberCanBuy : quantity,
  //         };
  //       }
  //       return cart;
  //     });

  //     newCartList = newCartList.filter((cart) => cart.quantity > 0);
  //     dispatch({
  //       type: "UPDATE_CART",
  //       payload: newCartList,
  //     });
  //     getCartListGuest(newCartList);
  //   }
  // };

  // useEffect(() => {
  //   const userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
  //   CustomerSerieAPI.getSerieData({
  //     serieId: itemInfo.episode.serieId,
  //     userInfo: userInfo,
  //   }).then((data) => {
  //     setAuthorId(data.createdBy._id);
  //   });
  // }, []);

  const moveToNft = (episodeId) => {
    router.push({
      pathname: "/episode",
      query: { episodeId, },
    });
  };

  return (
    <>
      <div className={`${style["cart-item"]}`}>
        <div className={`${style["check-box"]}`}>
          {/* <Checkbox checked={isCheck} onClick={() => toogleIsCheckCart(_id)} /> */}
        </div>
        <div
          className={`${style["cart-item-image"]}`}
          onClick={() => moveToNft(episodeId)}
        >
          {thumbnail && <Image src={thumbnail} width={95} height={95} />}
        </div>

        <div className={`${style["cart-item-name"]}`}>
          <div onClick={() => moveToNft(episodeId)}>
            {name ? name : ""}
          </div>
          <div
            className={`${style["cart-item-creator-name"]}`}
            onClick={() => {
              router.push(`/shop/${authorId}`);
            }}
          >
            {"Trinh Van Thuan"}
          </div>
        </div>

        <div className={`${style["cart-item-price"]} ${style["unit"]}`}>
          {price} USD
        </div>

        <div className={`${style["cart-item-price"]} ${style["total-price"]}`}>
          {price} USD
        </div>
        <div
          className={`${style["remove-item"]}`}
          onClick={() => {
            // updateQuantity(0);
          }}
        >
          {t("common:remove")}
        </div>
      </div>
    </>
  );
};
