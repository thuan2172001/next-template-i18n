import style from "./c-modal.module.scss";
import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { Modal, Divider, Button } from "antd";
import CreatorEpisodeAPI from "../../../api/creator/episode";
import { GetUserInfo } from "src/api/auth";

export const PublishFreeItemModal = ({
  updateModalVisible,
  episodeInfo,
  showPendingModal,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const publishEpisode = () => {
    setLoading(true);
    showPendingModal();
    CreatorEpisodeAPI.handleEpisodePublishStatus({
      userInfo: GetUserInfo(),
      action: "publish",
      episodeId: episodeInfo?._id,
    });
  };

  return (
    <Modal
      visible={true}
      width={732}
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
          {t("common:nft.publishItem")}
        </div>
        <div className={`${style["ep-name"]}`}>
          <img src="/icons/nft-product-item/book.svg" height={30} width={30} />
          <div className={`${style["name"]}`}>{episodeInfo?.name}</div>
        </div>

        <div className={`${style["modal-message"]}`}>
          {t("common:nft.publishFreeMessage")}
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
            className={`${style["footer-btn"]} ${style["save"]}`}
            onClick={publishEpisode}
          >
            {t("common:nft.publishItem")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
