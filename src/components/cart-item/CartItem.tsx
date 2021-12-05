import {useTranslation} from "next-i18next";
import {useState} from "react";
import Image from "next/image";
import style from "./item.module.scss";
import CustomerCartAPI from "../../api/customer/cart";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";

export const CartItem = ({
                             itemInfo,
                             getCartList,
                             getCartListGuest,
                         }) => {
    const {t} = useTranslation();
    const router = useRouter();
    const dispatch = useDispatch();

    const cartList = useSelector((state: any) => state.cart?.cartList);
    const {thumbnail, price, serieId, episodeId, name} = itemInfo;

    const removeItem = () => {
        let newCartList = [];
        console.log(cartList)
        console.log(episodeId);
        const index = cartList.indexOf(episodeId);
        console.log(index);
        cartList.splice(index, 1);
        newCartList = [...new Set([...cartList])];
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
        }
    }

    const moveToNft = (episodeId) => {
        router.push({
            pathname: "/episode",
            query: {episodeId,},
        });
    };

    return (
        <>
            <div className={`${style["cart-item"]}`}>
                <div className={`${style["check-box"]}`}>
                </div>
                <div
                    className={`${style["cart-item-image"]}`}
                    onClick={() => moveToNft(episodeId)}
                >
                    {thumbnail && <Image src={thumbnail} width={95} height={95}/>}
                </div>

                <div className={`${style["cart-item-name"]}`}>
                    <div onClick={() => moveToNft(episodeId)}>
                        {name ? name : ""}
                    </div>
                </div>

                <div className={`${style["cart-item-price"]} ${style["total-price"]}`}>
                    {price ?? 0} USD
                </div>
                <div
                    className={`${style["remove-item"]}`}
                    onClick={() => {
                        removeItem();
                    }}
                >
                    {t("common:remove")}
                </div>
            </div>
        </>
    );
};
