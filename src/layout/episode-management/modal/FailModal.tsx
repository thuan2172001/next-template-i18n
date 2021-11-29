import style from "./modal.module.scss";
import React from "react";
import { Modal, Button } from "antd";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

export const EpManageFailModal = ({
  updateModalVisible,
}) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Modal
      visible={true}
      width={539}
      transitionName="none"
      maskTransitionName="none"
      closable={false}
      maskClosable={false}
      onCancel={updateModalVisible}
      centered={true}
      bodyStyle={{ padding: "0px" }}
      footer={null}
    >
      <div className={`${style["modal-common"]}`}>
        <div className={`${style["modal-header"]}`}>
          <img src="/assets/icons/oh-no.svg" />
        </div>
        <div className={`${style["modal-msg"]}`}>
          {t("common:smModal.failed")}
        </div>
        <div className={`${style["footer"]}`}>
          <Button
            className={`${style["normal-btn-1"]}`}
            onClick={() => {
              updateModalVisible();
              if (router.query.serieId) {
              }
            }}
          >
            {t("common:smModal.close")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
