import { Modal } from "antd";
import style from "./modal.module.scss";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import {useState} from "react";

export const PendingPrivateSerieModal = ({
  serieInfo = null,
  updateModalType = null,
  closeShop = false,
}) => {
  const [visible, setVisible] = useState(true);
  const { t } = useTranslation();

  const router = useRouter();

  return (
    <Modal
      visible={visible}
      footer={null}
      closable={false}
      maskClosable={false}
      centered
    >
      <div className={`${style["modal-common"]}`}>
        <div className={`${style["confirm-icon"]}`}>
          <Image src="/assets/icons/pending-payment.svg" height={56} width={56} />
        </div>

        <div className={`${style["success-message"]}`}>
          <span className={`${style["series-name"]}`}>{serieInfo?.name} </span>
          {closeShop ? t("shop:confirmShopStatus.closing") :t("common:smModal.pendingPrivate1")}
          <br />
          {t("common:smModal.pendingPrivate2")}
        </div>

        <div className={`${style["custom-modal-footer"]}`}>
          <div
            className={`${style["footer-button"]}  ${style["save-active"]} ${style["m-r-10"]}`}
            onClick={() => router.push("/?page=1")}
          >
            {t("common:smModal.goToHomePage")}
          </div>
          <div
            className={`${style["footer-button"]} ${style["continue-create"]} ${style["m-l-10"]}`}
            onClick={() => {
              if (closeShop) {
                setVisible(false);
              } else {
                updateModalType({ type: "" });
                router.push("/sm?view=public&page=1");
              }

            }}
          >
            {closeShop ? t("common:smModal.backToShopSetting") : t("common:smModal.backToSeries")}
          </div>
        </div>
      </div>
    </Modal>
  );
};
