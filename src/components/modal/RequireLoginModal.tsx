import React from "react";
import { Modal, Button } from "antd";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import style from "./require-login.module.scss";

export const RequireLoginModal = ({ updateModalVisible, isFrom = "" }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const handleRoute = () => {
    localStorage.setItem("routeFromLoginModal", isFrom);
    router.push("/login");
  };
  return (
    <Modal
      visible={true}
      footer={null}
      closable={false}
      maskClosable={true}
      width={350}
      onCancel={() => updateModalVisible()}
    >
      <div className={`${style["modal-header"]}`}>
        {t("common:requireSignInModal.modalHeader")}
      </div>
      <Button className={`${style["modal-btn"]}`} onClick={() => handleRoute()}>
        {t("common:requireSignInModal.login")}
      </Button>
      <Button
        className={`${style["modal-btn"]}`}
        onClick={() => router.push("/signup")}
      >
        {t("common:requireSignInModal.signUp")}
      </Button>
    </Modal>
  );
};
