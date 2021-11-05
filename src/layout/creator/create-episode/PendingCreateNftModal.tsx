import { Modal } from "antd";
import style from "./create-episode.module.scss";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

export const PendingCreateNftModal = ({ refreshPage }) => {
  const { t } = useTranslation();

  const router = useRouter();

  return (
    <Modal visible={true} footer={null} closable={false} maskClosable={false}>
      <div className={`${style["modal-common"]}`}>
        <div className={`${style["confirm-icon"]}`}>
          <Image src="/assets/icons/pending-payment.svg" height={56} width={56} />
        </div>

        <div className={`${style["success-message"]}`}>
          {t("account:pendingNft1")}<br/>
          {t("account:pendingNft2")}
        </div>

        <div className={`${style["custom-modal-footer"]}`}>
          <div
            className={`${style["footer-button"]}  ${style["save-active"]} ${style["m-r-10"]}`}
            onClick={() => router.push("/?page=1")}
          >
            {t("account:goToHomepage")}
          </div>
          <div
            className={`${style["footer-button"]} ${style["continue-create"]} ${style["m-l-10"]}`}
            onClick={() => {
              router.push("/sm?view=public&page=1")
            }}
          >
            {t("account:continueCreating")}
          </div>
        </div>
      </div>
    </Modal>
  );
};
