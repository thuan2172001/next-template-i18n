import { Modal } from "antd";
import style from "./modal.module.scss";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

export const SuccessPrivateSerieModal = ({
  updateModalType = null,
  serieName = "",
}) => {
  const { t } = useTranslation();

  const handleClose = () => {
    updateModalType({ type: "" });
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
          <Image src="/assets/icons/success.png" height={56} width={56} />
        </div>

        <div className={`${style["success-message"]}`}>
          <div>
            {t("common:smModal.success")}
            {/* <span className={`${style["series-name"]}`}>{serieName}</span> */}
          </div>
        </div>

        <div className={`${style["custom-modal-footer"]}`}>
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
