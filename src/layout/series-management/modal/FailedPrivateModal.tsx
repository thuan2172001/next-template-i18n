import { Modal } from "antd";
import style from "./modal.module.scss";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

export const FailedPrivateSerieModal = ({
  updateModalType = null,
  serieName = "",
  closeShop = false,
}) => {
  const { t } = useTranslation();

  const router = useRouter();

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
          <Image src="/icons/oh-no.svg" height={56} width={56} />
        </div>

        <div className={`${style["fail-message"]}`}>
          {t("common:smModal.failPrivated1")}
          {closeShop ? (
            t("common:confirmShopStatus.closeShopFail")
          ) : (
            <span>
              <span className={`${style["series-name"]}`}> {serieName} </span>
              {t("common:smModal.failPrivated2")}
            </span>
          )}
        </div>

        <div className={`${style["custom-modal-footer"]}`}>
          <div
            className={`${style["footer-button"]}  ${style["save-active"]} ${style["m-r-10"]}`}
            onClick={() => {
              updateModalType({ type: "" });
              if (closeShop) {
              } else {
                router.push("/sm?view=public&page=1");
              }
            }}
          >
            {t("common:smModal.tryAgain")}
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
