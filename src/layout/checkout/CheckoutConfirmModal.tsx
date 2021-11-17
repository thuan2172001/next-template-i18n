import { Modal, Row, Button, Col } from "antd";
import Image from "next/image";
import { useState, useEffect } from "react";
import CustomerPaymentAPI from "../../api/customer/payment";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import style from "./checkout-confirm.module.scss";

export const CheckoutConfirmModal = ({
  updateModalVisible,
  modalType,
  cartList,
  paymentMethod,
  triggerRefetchCart,
  totalPrice,
}) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const router = useRouter();

  const isCheckoutPending = useSelector((state: any) => {
    return state.cart.isCheckoutPending;
  });
  const [isLoading, setLoading] = useState(isCheckoutPending);
  const [isSuccess, setSuccess] = useState(false);
  const [bookshelf, setBookshelf] = useState([]);

  useEffect(() => {
    setLoading(isCheckoutPending);
  }, [isCheckoutPending]);

  const doCheckout = () => {
    dispatch({ type: "UPDATE_CHECKOUT_PENDING", payload: true });

    const userInfo = JSON.parse(window.localStorage.userInfo);

    CustomerPaymentAPI.checkout({
      userInfo,
      cartList: cartList.map((e) => {
        return e.episodeId
      }),
      paymentMethod,
      totalPrice,
    }).then((response) => {
      const data = response.data || response;

      if (data.code === 500 && data.reason === "CART.EXCEED_ITEM_QUANTITY") {
        setSuccess(false);
      }

      if (data.status === "succeeded") {
        setSuccess(true);

        triggerRefetchCart(true);
      } else if (data.status === "pending") {
        window.localStorage.setItem("checkPendingPayment", "true");

        updateModalVisible("pending");
      }
    });
  };

  const _isPurchaseMultiple = (_cartList) => {
    if (!_cartList || !Array.isArray(_cartList) || _cartList.length === 0)
      return false;

    return _cartList.filter((item) => item.numberEdition > 1).length > 0;
  };

  const _renderConfirmMultipleModal = () => (
    <Modal
      visible={true}
      onCancel={() => updateModalVisible()}
      footer={null}
      closable={false}
      width={539}
      transitionName="none"
      maskTransitionName="none"
      maskClosable={false}
    >
      <div className={`${style["modal-common"]}`}>
        <div className={`${style["confirm-icon"]}`}>
          <Image
            src={
              isSuccess ? "/assets/icons/success.png" : "/assets/icons/question.svg"
            }
            height={56}
            width={56}
          />
        </div>

        {bookshelf.length > 0 && (
          <div
            className={`${style["success-message"]} ${style["text-align-start"]}`}
          >
            {!isSuccess && t("account:mutipleConfirm2")}
          </div>
        )}

        {!isSuccess && bookshelf.length > 0 && (
          <div className={`${style["confirm-list"]}`}>
            {bookshelf &&
              bookshelf.map((item, index) => (
                <>
                  <Row key={index}>
                    <div>
                      <Image src="/assets/icons/book.svg" height={30} width={30} />
                    </div>

                    <div className={`${style["cart-item-info"]}`}>
                      <span className={`${style["blue-text"]}`}>
                        {item?.serie?.serieName}
                      </span>{" "}
                      - {item.name}: <span>You already have </span>
                      <span className={`${style["bold-number-of-edition"]}`}>
                        {item.numberOfCopy}
                      </span>{" "}
                      {item.numberOfCopy > 1
                        ? t("account:editions")
                        : t("account:edition")}
                    </div>
                  </Row>

                  <div className={`${style["space-between-item"]}`}></div>
                </>
              ))}
          </div>
        )}

        {_isPurchaseMultiple(cartList) && (
          <div
            className={
              !isSuccess
                ? `${style["success-message"]} ${style["text-align-start"]} ${style["align-top-container"]}`
                : `${style["success-message"]}`
            }
          >
            {isSuccess ? "" : t("account:mutipleConfirm1")}
          </div>
        )}

        {isSuccess && (
          <div className={`${style["success-message"]}`}>
            {t("account:successPurchase")}
          </div>
        )}

        {!isSuccess && (
          <div
            className={
              _isPurchaseMultiple(cartList)
                ? `${style["confirm-list"]}`
                : `${style["confirm-list-hide"]}`
            }
          >
            {cartList &&
              cartList
                .filter((item) => item.numberEdition > 1)
                .map((item, index) => (
                  <>
                    <Row key={index}>
                      <div>
                        <Image src="/assets/icons/book.svg" height={30} width={30} />
                      </div>

                      <div className={`${style["cart-item-info"]}`}>
                        <span className={`${style["blue-text"]}`}>
                          {item?.serieName}
                        </span>{" "}
                        - {item.itemName}:{" "}
                        <span className={`${style["bold-number-of-edition"]}`}>
                          {item.numberEdition}
                        </span>{" "}
                        {item.numberEdition > 1
                          ? t("account:editions")
                          : t("account:edition")}
                      </div>
                    </Row>

                    <div className={`${style["space-between-item"]}`}></div>
                  </>
                ))}
          </div>
        )}

        <div className={`${style["custom-modal-footer"]}`}>
          {isSuccess && (
            <div
              className={`${style["footer-button"]} ${style["save-active-margin-right"]}`}
              onClick={() => router.push("/user/bookshelf")}
            >
              {t("account:goToBookshelf")}
            </div>
          )}

          <div
            className={`${style["footer-button"]} ${style[!isSuccess ? "cancel" : "cancel-not-margin"]
              }`}
            onClick={() => {
              if (isSuccess) {
                router.push("/user/cart");
              }
              updateModalVisible();
            }}
          >
            {isSuccess ? t("account:closePopup1") : t("account:closePopup2")}
          </div>

          {!isSuccess && (
            <Button
              className={`${style["footer-button"]} ${style["save-active"]}`}
              onClick={() => doCheckout()}
              loading={isLoading}
            >
              {t("account:confirm")}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );

  const _renderModal = () => {
    return _renderConfirmMultipleModal();
  };

  return _renderModal();
};
