import { Modal } from "antd";
import Image from "next/image";
import { useState } from "react";
import CartSetupForm from "./CardSetupForm";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import style from "./popup-add-payment-method.module.scss";

export const AddPaymentMethodModal = ({
  updateModalVisible,
  type,
  setReload,
}) => {
  const { t } = useTranslation();

  const [isSaveSuccess, setSaveSuccess] = useState(false);

  const router = useRouter();

  const displayConfirmButton = () => {
    const pathName = router.pathname;

    switch (pathName) {
      case "/user/checkout":
        return t("add-payment:continuePayment");

      case "/user/account":
        return t("add-payment:done");

      default:
        return t("add-payment:done");
    }
  };

  return (
    <>
      {(type === "addPayment" || type === "checkOut") && (
        <Modal
          width={731}
          closable={false}
          transitionName="none"
          maskTransitionName="none"
          maskClosable={false}
          visible={true}
          onCancel={() => {
            updateModalVisible();
            setSaveSuccess(false);
          }}
          footer={null}
        >
          <div className={`${style["modal-common"]}`}>
            {isSaveSuccess ? (
              <div className={`${style["center-content"]}`}>
                <div className={`${style["success-icon"]}`}>
                  <Image src="/icons/success.png" height={56} width={56} />
                </div>

                <div className={`${style["success-message"]}`}>
                  {t("add-payment:addSuccess")}
                </div>

                <div
                  className={`${style["footer-button"]} ${style["save-active"]} ${style["cursor-pointer"]}`}
                  onClick={() => {
                    setReload(true);
                    updateModalVisible();
                    setSaveSuccess(false);
                  }}
                >
                  {displayConfirmButton()}
                </div>
              </div>
            ) : (
              <div className={style["container"]}>
                <div className={`${style["modal-header"]}`}>
                  {t("add-payment:addPayment")}
                </div>

                <div className={`${style["verify-message"]}`}>
                  <div className={`${style["verify-icon"]}`}>
                    <img src="/icons/verified.png" />
                  </div>

                  <div className={`${style["verify-text-container"]}`}>
                    <p className={`${style["verify-text1"]}`}>
                      {t("add-payment:claim.block1")}
                    </p>

                    <p>{t("add-payment:claim.block2")}</p>
                  </div>
                </div>

                <CartSetupForm
                  markSetupSuccess={(value) => setSaveSuccess(value)}
                  markCancel={(value) => value && updateModalVisible()}
                  type={type}
                />
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};
