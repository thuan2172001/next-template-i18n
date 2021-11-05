import style from "./modal.module.scss";
import React from "react";
import { Modal, Button } from "antd";
import { useRouter } from "next/router";

export const EpManageSuccessModal = ({
  updateModalVisible,
  type,
  episodeName,
  serieId,
  episodeId,
}) => {
  const router = useRouter();
  const moveToNft = () => {
    updateModalVisible();
    router.push(`/episode?serieId=${serieId}&episodeId=${episodeId}`);
  };
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
          <img src="/assets/icons/em/success.svg" />
        </div>
        <div className={`${style["modal-msg"]}`}>
          Successfully{" "}
          {type === "publish" ? <span>published</span> : <span>privated</span>}{" "}
          <span className={`${style["nft-name"]}`}>{episodeName}</span>
        </div>
        <div className={`${style["footer"]}`}>
          <Button className={`${style["active-btn"]}`} onClick={moveToNft}>
            Detail
          </Button>
          <Button
            className={`${style["normal-btn-1"]}`}
            onClick={() => {
              updateModalVisible();
              if (router.query.serieId) {
                window.location.reload();
              }
            }}
          >
            Close pop-up
          </Button>
        </div>
      </div>
    </Modal>
  );
};
