import style from "./modal.module.scss";
import React from "react";
import { Modal, Button } from "antd";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

export const EpManagePendingModal = ({
  updateModalVisible,
  type,
  episodeName,
  serieId = null,
}) => {
  const router = useRouter();

  const movetToHome = () => {
    router.push("/?page=1");
  };

  const moveToEM = () => {
    if (type === "publish")
      router.push(`/em?view=private&serieId=${serieId}&page=1`);
    else router.push(`/em?view=public&serieId=${serieId}&page=1`);
  };

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
        </div>
        <div className={`${style["modal-msg"]}`}>
          <span className={`${style["nft-name"]}`}>{episodeName}</span> {t("common:episode.isBeing")}{" "}
          {type === "publish" ? <span>{t("common:episode.published")}</span> : <span>{t("common:episode.privated")}</span>}.
        </div>
        <div className={`${style["footer"]}`}>
          <Button className={`${style["active-btn"]}`} onClick={movetToHome}>
            {t("common:episode.goHomePage")}
          </Button>
          <Button className={`${style["normal-btn"]}`} onClick={moveToEM}>
            {t("common:episode.backToEpisode")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
