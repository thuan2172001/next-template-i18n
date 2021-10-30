import { Modal, Button } from "antd";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import style from "./create-episode.module.scss";

export const CustomCancelCreateNftModal = ({ updateModalVisible }) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Modal visible={true} footer={null} closable={false} maskClosable={false}>
      <div className={`${style["modal-common"]}`}>
        <div className={`${style["confirm-icon"]}`}>
          <img src="/icons/question.svg" height={56} width={56} />
        </div>

        <div className={`${style["success-message"]}`}>
          {t("create_serie:createNft.cancelAlert")}
          <div>{t("create_serie:createNft.cancelConfirm")}</div>
        </div>

        <div className={`${style["custom-modal-footer"]}`}>
          <Button
            className={`${style["footer-button"]} ${style["cancel"]} ${style["create-nft-btn"]}`}
            onClick={() => {
              let link = window.localStorage.getItem("popup-url");
              link.length > 1 ? router.push(link) : router.push(`/`);

              window.localStorage.removeItem("popup-url");
            }}
          >
            {t("create_serie:createNft.leave")}
          </Button>
          <div
            className={`${style["footer-button"]} ${style["cancel"]} ${style["create-nft-btn"]} ${style["save-active"]}`}
            onClick={() => {
              updateModalVisible(false);
            }}
          >
            {t("create_serie:createNft.cancel")}
          </div>
        </div>
      </div>
    </Modal>
  );
};
