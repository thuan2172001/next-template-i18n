import { Modal, Button } from "antd";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import style from "./create-episode.module.scss";
import { useState } from "react";

export const CreateNftModal = ({ updateModalVisible, upLoad, isLoading }) => {
  const { t } = useTranslation();
  const [clickCreate, setClickCreate] = useState(false);
  return (
    <Modal visible={true} footer={null} closable={false} maskClosable={false}>
      <div className={`${style["nft-modal"]}`}>
        <div className={`${style["confirm-icon"]}`}>
          <Image src="/assets/icons/question.svg" height={56} width={56} />
        </div>

        <div className={`${style["confirm-msg"]}`}>
          {t("create-series:createNft.createNftConfirm")}
        </div>

        <div className={`${style["custom-modal-footer"]}`}>
          <Button
            className={`${style["footer-button"]} ${style["cancel"]} ${style["create-nft-btn"]}`}
            onClick={() => {
              !clickCreate && updateModalVisible();
            }}
            disabled={clickCreate}
          >
            {t("create-series:createNft.cancel")}
          </Button>

          <Button
            type="primary"
            className={`${style["save-active"]} ${style["footer-button"]} ${style["create-nft-btn"]}`}
            onClick={() => {
              !clickCreate && upLoad();
              setClickCreate(true);
            }}
            loading={isLoading}
          >
            {t("create-series:createNft.createItem")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
