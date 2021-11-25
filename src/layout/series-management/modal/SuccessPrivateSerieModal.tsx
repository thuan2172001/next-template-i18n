import { Modal } from "antd";
import style from "./modal.module.scss";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

export const SuccessPrivateSerieModal = ({
  updateModalType = null,
  serieName = "",
  closeShop = false,
}) => {
  const { t } = useTranslation();

  const router = useRouter();

  const switchToPrivateTab = () => {
    updateModalType({ type: "" });
    router.push("/sm?view=private&page=1");
  };

  const handleClose = () => {
    if (!closeShop) {
      updateModalType({ type: "" });
      if (router.pathname === "/sm" || router.pathname === "/em")
        window.location.reload();
    } else {
      updateModalType({ type: "" });
      if (
        router.pathname === "/sm" ||
        router.pathname === "/em" ||
        router.pathname === "/"
      )
        window.location.reload();
    }
  };

  return (
    <Modal
      visible={true}
      footer={null}
      closable={false}
      maskClosable={false}
      centered
    >
      <div className={`${style["modal-common"]}`}>
        <div className={`${style["confirm-icon"]}`}>
          <Image src="/icons/success.png" height={56} width={56} />
        </div>

        <div className={`${style["success-message"]}`}>
          {closeShop ? (
            <div>{t("common:confirmShopStatus.shopCloseSuccess")}</div>
          ) : (
            <div>
              {t("common:smModal.successPrivated")}
              <span className={`${style["series-name"]}`}> {serieName}</span>
            </div>
          )}
        </div>

        <div className={`${style["custom-modal-footer"]}`}>
          <div
            className={`${style["footer-button"]}  ${style["save-active"]} ${style["m-r-10"]}`}
            onClick={() => {
              if (closeShop) {
                updateModalType("");
              } else {
                switchToPrivateTab();
              }
            }}
          >
            {closeShop
              ? t("common:confirmShopStatus.goToShopSetting")
              : t("common:smModal.seeInSeries")}
          </div>
          <div
            className={`${style["footer-button"]} ${style["close"]} ${style["m-l-10"]}`}
            onClick={handleClose}
          >
            {t("common:smModal.close")}
          </div>
        </div>
      </div>
    </Modal>
  );
};
