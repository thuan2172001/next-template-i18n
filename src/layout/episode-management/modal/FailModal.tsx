import style from "./modal.module.scss";
import React from "react";
import { Modal, Button } from "antd";
import { useRouter } from "next/router";

export const EpManageFailModal = ({
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
          <img src="/assets/icons/em/oh-no.svg" />
        </div>
        <div className={`${style["modal-msg"]}`}>
          Oh no! <span className={`${style["nft-name"]}`}>{episodeName}</span>{" "}
          {type === "publish" ? <span>public</span> : <span>private</span>}{" "}
          failed.
        </div>
        <div className={`${style["footer"]}`}>
          <Button className={`${style["active-btn"]}`} onClick={moveToNft}>
            Try again
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
