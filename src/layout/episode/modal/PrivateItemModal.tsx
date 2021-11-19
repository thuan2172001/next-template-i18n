import style from "./c-modal.module.scss";
import React, {useState} from "react";
import {useTranslation} from "next-i18next";
import {Modal, Divider, Button} from "antd";
import CreatorEpisodeAPI from "../../../api/creator/episode";
import {GetUserInfo} from "src/api/auth";

export const PrivateItemModal = ({
                                   updateModalVisible,
                                   episodeInfo,
                                   showPendingModal,
                                 }) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);

  const handelUnPublishItem = () => {
    if (!episodeInfo) return;
    setLoading(true);
    showPendingModal();
    CreatorEpisodeAPI.handleEpisodePublishStatus({
      userInfo: GetUserInfo(),
      body: {
        type: "UNPUBLISH",
        episodeId: episodeInfo?.episodeId,
      }
    });
  };

  return (
    <Modal
      visible={true}
      width={600}
      transitionName="none"
      maskTransitionName="none"
      closable={false}
      maskClosable={false}
      onCancel={updateModalVisible}
      centered={true}
      bodyStyle={{padding: "24px 0px"}}
      footer={null}
    >
      <div className={`${style["modal-common"]}`}>
        <div className={`${style["modal-header"]}`}>
          {t("common:nft.privateItem")}
        </div>

        <div className={`${style["modal-message-private"]}`}>
          {episodeInfo?.isFree ? (
            <>
              {`${t("common:nft.privateItem1")} "${episodeInfo?.name}" ${t(
                "common:nft.privateItem2"
              )}`}
            </>
          ) : (
            <>
              {`${t("common:nft.privateItem1")} "${episodeInfo?.name}" ${t(
                "common:nft.privateItem3"
              )}`}
            </>
          )}
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
            loading={loading}
            disabled={loading}
            className={`${style["footer-btn"]} ${style["ml-30"]}`}
            onClick={() => handelUnPublishItem()}
          >
            {t("common:nft.privateItem")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
