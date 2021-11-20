import style from "./c-modal.module.scss";
import React, {useState} from "react";
import {useTranslation} from "next-i18next";
import {Modal, Divider, Button, Form, Row, Col, Input} from "antd";
import CreatorEpisodeAPI from "../../../api/creator/episode";
import {GetUserInfo} from "src/api/auth";

export const PublishNonFreeItemModal = ({
                                          updateModalVisible,
                                          episodeInfo,
                                          showPendingModal,
                                        }) => {
  const {t} = useTranslation();

  const handlePublish = () => {
    showPendingModal();
    CreatorEpisodeAPI.handleEpisodePublishStatus({
      userInfo: GetUserInfo(),
      body: {
        type: "PUBLISH",
        episodeId: episodeInfo?.episodeId,
      }
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
      centered={true}
      bodyStyle={{padding: "24px 0px"}}
      footer={null}
    >
      <div className={`${style["modal-common"]}`}>
        <div className={`${style["modal-header"]}`}>
          {t("common:episode.publishItem")}
        </div>
        <div className={`${style["ep-name"]}`}>
          <div className={`${style["name"]}`}>{episodeInfo?.name}</div>
        </div>


        <Divider className={`${style["divider"]}`}/>

        <div className={`${style["modal-footer"]}`}>
          <Button
            className={`${style["footer-btn"]}`}
            onClick={updateModalVisible}
          >
            {t("common:cancel")}
          </Button>
          <Button
            className={`${style["footer-btn"]} ${style["save"]}`}
            onClick={handlePublish}
          >
            {t("common:episode.publishItem")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
