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
import CustomerBookshelfAPI from "../../api/customer/bookshelf";
import { useTranslation } from "next-i18next";
// import { PendingCheckoutModal } from "@components/account-modal/PendingCheckoutModal";
import { AddPaymentMethodModal } from "./AddPaymentMethodModal";
import style from "./checkout.module.scss";
import CustomerCartAPI from "../../api/customer/cart";

export const CheckoutTemplate = ({ cartList }) => {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const storedCart = useSelector((state: any) => {
        return state.cart.cartList;
    });

    const isCheckoutPending = useSelector((state: any) => {
        return state.cart.isCheckoutPending;
    });

    const router = useRouter();

    const [paymentList, setPaymentList] = useState([]);
    // const [cartList, setCartList] = useState(storedCart);
    const [modalType, setModalType] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [refetchPaymentMethod, forceRefetchPaymentMethod] = useState(1);
    const [sameEpisode, setSameEpisode] = useState([]);
    const [isLoading, setLoading] = useState(isCheckoutPending);
    const [openSuccessModal, closeSuccessModal] = useState(false);
    const [failedModal, setFailedModal] = useState(false);
    const [currentTotal, setCurrentTotal] = useState(0);

    useEffect(() => {
        calculateTotalPrice(cartList);
    }, [cartList])

    const calculateTotalPrice = (cartList) => {
        let tmpTotalPrice = 0;
        // let tmpTotalChecked = 0;
        cartList.forEach((cart) => {
            // if (cart.isCheck) {
            tmpTotalPrice += parseInt(cart.price);
            // tmpTotalChecked += 1;
            // }
        });
        console.log(tmpTotalPrice);
        setCurrentTotal(tmpTotalPrice);
    };
    // useEffect(() => {
    //     getCartLists()
    // },[])

    // useEffect(() => {
    //     setLoading(isCheckoutPending)
    // },[isCheckoutPending])


    useEffect(() => {
        // async function fetchCartList() {

        //     CustomerBookshelfAPI.getBookShelf({
        //         userInfo: GetUserInfo(),
        //     }).then((response) => {
        //         const data = response.episode || response;

        //         const cartItems = cartList.map((e: any) => e._id);

        //         setSameEpisode(
        //             data.filter((episode) => {
        //                 const { price } = episode;

        //                 if (price > 0) {
        //                     return cartItems.indexOf(episode._id) > -1;
        //                 }

        //                 return false;
        //             })
        //         );
        //     });
        // }

        CustomerPaymentAPI.getAllPaymentMethod({ userInfo: GetUserInfo() }).then(
            (response) => {
                const data = response.data || response;

                const customerPaymentList = data
                    .map((method) => ({
                        id: method.id,
                        imgSrc:
                            method.card.brand === "visa"
                                ? "/icons/visa.svg"
                                : "/icons/master-card.svg",
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

        // fetchCartList();
    }, [cartList]);

    // useEffect(() => {
    //     if (typeof window !== "undefined" && window.localStorage.userInfo) {
    //         CustomerPaymentAPI.getAllPaymentMethod({ userInfo: GetUserInfo() }).then(
    //             (response) => {
    //                 const data = response.data || response;
    //
    //                 const customerPaymentList = data
    //                     .map((method) => ({
    //                         id: method.id,
    //                         imgSrc:
    //                             method.card.brand === "visa"
    //                                 ? "/icons/visa.svg"
    //                                 : "/icons/master-card.svg",
    //                         name: method.card.brand === "visa" ? "Visa" : "Mastercard",
    //                         cardNumber: `**** **** **** ${method.card.last4}`,
    //                     }))
    //                     .sort((a, b) => b.created - a.created);
    //
    //                 const defaultPaymentMethod = customerPaymentList[0]
    //                     ? customerPaymentList[0].id
    //                     : "";
    //
    //                 setPaymentMethod(defaultPaymentMethod);
    //
    //                 setPaymentList(customerPaymentList);
    //             }
    //         );
    //     }
    // }, [refetchPaymentMethod]);

    // const getCartLists = () => {
    //     const userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    //     CustomerCartAPI.getCartCheckout({ userInfo}).then(res => {
    //         if(res.cartItems) {
    //             setCartList(res.cartItems.reverse());
    //             setCurrentTotal(calculateTotalPrice(res.cartItems))
    //         }
    //     })
    // }

    const renderPaymentSuccessModal = () => {
        return (
            <Modal
                visible={true}
                onCancel={() => {
                }}
                footer={null}
                closable={false}
                maskClosable={false}
            >
                <div className="modal-common">
                    <div className="confirm-icon">
                        <Image src={"/icons/success-purchase.svg"} height={56} width={56} />
                    </div>

                    <div className={`success-message`}>
                        {t("account:successPurchase")}
                    </div>

                    <div className="custom-modal-footer">
                        <div
                            className="footer-button save-active-margin-right"
                            onClick={() => router.push("/user/bookshelf")}
                        >
                            {t("account:goToBookshelf")}
                        </div>

                        <div
                            className={`footer-button cancel-not-margin`}
                            onClick={() => {
                                closeSuccessModal(false);

                                router.push("/user/cart");
                            }}
                        >
                            {t("account:closePopup1")}
                        </div>
                    </div>
                </div>
            </Modal>
        );
    };

    const refetchCart = () => {
        // router.push('/user/cart');
    };

    const doCheckout = (cartList) => {
        setLoading(true);
        dispatch({ type: 'UPDATE_CHECKOUT_PENDING', payload: true });

        console.log({ cartList })

        CustomerPaymentAPI.checkout({
            userInfo: GetUserInfo(),
            cartList: cartList.map((e) => {
                console.log({ e })
                return e.episodeId
            }),
            paymentMethod,
        }).then((response) => {
            if (!response.error) {
                closeSuccessModal(true);
                renderPaymentSuccessModal();
            }
            setLoading(false);
        });
    };

    // const _isPurchaseMultiple = (cartList) => {
    //     if (!cartList || !Array.isArray(cartList) || cartList.length === 0)
    //         return false;
    //
    //     if (Array.isArray(sameEpisode) && sameEpisode.length > 0) return true;
    //
    //     return cartList.filter((item) => item.numberEdition > 1).length > 0;
    // };
    //
    // const handleChangeCartQuantity = ({ cartItemId, count }) => {
    //     let newCartList = [];
    //
    //     for (let i = 0; i < cartList.length; i++) {
    //         if (cartList[i] && cartList[i].cartItemId === cartItemId) {
    //             newCartList.push({
    //                 ...cartList[i],
    //                 numberEdition: count,
    //             });
    //         } else {
    //             newCartList.push(cartList[i]);
    //         }
    //     }
    //
    //     dispatch({ type: "UPDATE_CART", payload: newCartList });
    //
    //     setCurrentTotal(calculateTotalPrice(newCartList));
    // };

    return (
        <div
            style={{
                minHeight: "100vh",
            }}
        >
            <TabLayout type="checkout" />

            <section className={style["cart"]}>
                <span className={style["cart-header"]}>{t("cart:cartHeader")}</span>

                <div className={style["cart-list"]}>
                    {cartList &&
                        cartList.map((itemInfo, index) => {
                            return (
                                <div key={index}>
                                    <CartItem
                                        // updateQuantity={({ cartItemId, count }) => {
                                        //     handleChangeCartQuantity({ cartItemId, count });
                                        // }}
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
                        {t("cart:orderTotal")} {`(${cartList.length} ${cartList.length > 1 ? ' items' : ' item'}):`}
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
                    Checkout
                </Button>

                {openSuccessModal && renderPaymentSuccessModal()}

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
                        triggerRefetchCart={(value) => value && refetchCart()}
                    />
                )}

                {/*{modalType === "pending" && <PendingCheckoutModal pendingModal={modalType === "pending"}/>}*/}
            </section>
        </div>
    );
};

