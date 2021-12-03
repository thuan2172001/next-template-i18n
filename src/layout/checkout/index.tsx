import React, { useEffect, useState } from "react";
import { TabLayout } from "@components/tab-layout";
import CartItem from "@components/cart-item/index";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { Radio, Space, Button, Modal } from "antd";
import { GetUserInfo } from "src/api/auth";
import { CheckoutConfirmModal } from "./CheckoutConfirmModal";
import { useRouter } from "next/router";
import CustomerPaymentAPI from "../../api/customer/payment";
import { useTranslation } from "next-i18next";
import { AddPaymentMethodModal } from "./AddPaymentMethodModal";
import style from "./checkout.module.scss";
import Head from "next/head";
import { notifySuccess } from "@components/toastify";

export const CheckoutTemplate = ({ cartList }) => {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const isCheckoutPending = useSelector((state: any) => {
        return state.cart.isCheckoutPending;
    });

    const router = useRouter();

    const [paymentList, setPaymentList] = useState([]);
    const [modalType, setModalType] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [refetchPaymentMethod, forceRefetchPaymentMethod] = useState(1);
    const [isLoading, setLoading] = useState(isCheckoutPending);
    const [openSuccessModal, closeSuccessModal] = useState(false);
    const [currentTotal, setCurrentTotal] = useState(0);

    useEffect(() => {
        calculateTotalPrice(cartList);
    }, [cartList])

    const calculateTotalPrice = (cartList) => {
        let tmpTotalPrice = 0;
        cartList.forEach((cart) => {
            console.log(cart.price);
            tmpTotalPrice += parseInt(cart.price ?? 0);
        });
        setCurrentTotal(tmpTotalPrice);
    };

    useEffect(() => {
        CustomerPaymentAPI.getAllPaymentMethod({ userInfo: GetUserInfo() }).then(
            (response) => {
                const data = response.data || response;

                const customerPaymentList = data
                    .map((method) => ({
                        id: method.id,
                        imgSrc:
                            method.card.brand === "visa"
                                ? "/assets/icons/visa.svg"
                                : "/assets/icons/master-card.svg",
                        name: method.card.brand === "visa" ? "Visa" : "Mastercard",
                        cardNumber: `**** **** **** ${method.card.last4}`,
                    }))
                    .sort((a, b) => b.created - a.created);

                const defaultPaymentMethod = customerPaymentList[0]
                    ? customerPaymentList[0].id
                    : "";

                setPaymentMethod(defaultPaymentMethod);

                setPaymentList(customerPaymentList);
            }
        );
    }, [cartList, refetchPaymentMethod]);

    const refetchCart = () => {
    };

    const doCheckout = (cartList) => {
        setLoading(true);
        dispatch({ type: 'UPDATE_CHECKOUT_PENDING', payload: true });

        CustomerPaymentAPI.checkout({
            userInfo: GetUserInfo(),
            cartList: cartList.map((e) => {
                return e.episodeId
            }),
            paymentMethod,
            totalPrice: currentTotal,
        }).then((response) => {
            if (!response.error) {
                closeSuccessModal(true);
                notifySuccess(t("common:successPurchased"));
                router.push("/user/bookshelf");
            }
            dispatch({ type: "UPDATE_CART", payload: [] });
            setLoading(false);
        });
    };

    return (
        <div
            style={{
                minHeight: "100vh",
            }}
        >
            <Head>
                <title>WebtoonZ | {t("cart:cartHeader")}</title>
            </Head>
            <TabLayout type="checkout" />

            <section className={style["cart"]}>
                <span className={style["cart-header"]}>{t("cart:cartHeader")}</span>

                <div className={style["cart-list"]}>
                    {cartList &&
                        cartList.map((itemInfo, index) => {
                            return (
                                <div key={index}>
                                    <CartItem
                                        key={index}
                                        itemInfo={itemInfo}
                                        type="checkout"
                                    />
                                    {index < cartList.length - 1 && (
                                        <hr className={style["cart-divider"]} />
                                    )}
                                </div>
                            );
                        })}
                </div>

                <div className={style["order-total"]}>
                    <span className={style["order-total-name"]}>
                        {t("cart:orderTotal")} {`(${cartList.length} ${cartList.length > 1 ? ` ${t("common:cartItem.items")}` : ` ${t("common:cartItem.item")}`}):`}
                    </span>
                    <span className={style["order-total-number"]}>{currentTotal + " USD"}</span>
                </div>

                <section
                    className={style["payment-section"]}
                    style={{ marginTop: "50px", marginBottom: "30px" }}
                >
                    <span className={`${style["cart-header"]}`}>
                        {t("cart:paymentMethod")}
                    </span>

                    <div className={`${style["payment-list"]} ${paymentList.length > 0 && style["has-card"]}`}>
                        {paymentList.length > 0 ? (
                            <div>
                                <Radio.Group
                                    name="radiogroup"
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    value={paymentMethod}
                                >
                                    <Space direction="vertical">
                                        {paymentList.map((el, index) => {
                                            return (
                                                <Radio key={el.id} value={el.id}>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            width: "500px",
                                                            position: "relative",
                                                            top: "12px",
                                                        }}
                                                        className={`${style["card-list"]}`}
                                                    >
                                                        <span>
                                                            <Image src={el.imgSrc} height={34} width={48} />
                                                        </span>

                                                        <span className={style["account-card-name"]}>
                                                            {el.name}
                                                        </span>

                                                        <span className={style["account-card-number"]}>
                                                            {el.cardNumber}
                                                        </span>
                                                    </div>
                                                </Radio>
                                            );
                                        })}
                                    </Space>
                                </Radio.Group>

                                <div
                                    className={style["add-another-cart"]}
                                    onClick={() => setModalType("checkOut")}
                                >
                                    {t("cart:useOtherCard")}
                                </div>
                            </div>
                        ) : (
                            <div
                                className={`${style["add-payment-method-btn"]}`}
                                onClick={() => setModalType("checkOut")}
                            >
                                {t("cart:addPaymentMethod")}
                            </div>
                        )}
                    </div>
                </section>

                <Button
                    loading={isLoading}
                    className={`${style["checkout-cart"]}`}
                    style={{ marginLeft: 0 }}
                    disabled={!paymentList || paymentList.length === 0}
                    onClick={async () => {
                        doCheckout(cartList);
                    }}
                >
                    {t("common:checkout")}
                </Button>

                {modalType !== "" && modalType !== "checkout" && (
                    <AddPaymentMethodModal
                        type={modalType}
                        updateModalVisible={setModalType}
                        setReload={(value) =>
                            value && forceRefetchPaymentMethod(refetchPaymentMethod + 1)
                        }
                    />
                )}

                {modalType === "confirm" && (
                    <CheckoutConfirmModal
                        updateModalVisible={setModalType}
                        modalType={modalType}
                        cartList={cartList}
                        paymentMethod={paymentMethod}
                        totalPrice={currentTotal}
                        triggerRefetchCart={(value) => value && refetchCart()}
                    />
                )}
            </section>
        </div>
    );
};

