import style from "./c-modal.module.scss";
import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { Modal, Divider, Button } from "antd";
import CreatorEpisodeAPI from "../../../api/creator/episode";
import { GetUserInfo } from "src/api/auth";
import { notifySuccess, notifyError } from "@components/toastify";

export const DeleteItemModal = ({
  modalVisible,
  updateModalVisible,
  episodeInfo,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleDeleteItem = () => {
    if (!episodeInfo) return;
    setLoading(true);
    CreatorEpisodeAPI.deleteEpisode({
      userInfo: GetUserInfo(),
      episodeId: episodeInfo?.episodeId,
    }).then(data => {
      notifySuccess(t("common:successMsg.deleteSuccess"));
      updateModalVisible(false);
      window.location.reload();
    }).catch(err => {
      notifyError(t("common:errorMsg.deleteFailed"));
      updateModalVisible(false);
    });
  };

  return (
    <Modal
      visible={modalVisible}
      width={600}
      transitionName="none"
      maskTransitionName="none"
      closable={false}
      maskClosable={false}
      onCancel={updateModalVisible}
      centered={true}
      bodyStyle={{ padding: "24px 0px" }}
      footer={null}
    >
      <div className={`${style["modal-common"]}`}>
        <div className={`${style["modal-header"]}`}>
          {t("common:episode.deleteItem")}
        </div>

        <div className={`${style["modal-message-private"]}`}>
          {`${t("common:episode.deleteItem1")} "${episodeInfo?.name}" ${t(
            "common:episode.deleteItem2"
          )}`}
        </div>
        <Divider className={`${style["divider"]}`} />

        <div className={`${style["modal-footer"]}`}>
          <Button
            className={`${style["footer-btn"]}`}
            onClick={updateModalVisible}
          >
            {t("common:cancel")}
          </Button>
          <Button
            loading={loading}
            disabled={loading}
            className={`${style["footer-btn"]} ${style["ml-30"]}`}
            onClick={() => handleDeleteItem()}
          >
            {t("common:episode.deleteItem")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
