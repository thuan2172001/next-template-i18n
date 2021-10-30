import style from "./modal.module.scss";
import React from "react";
import { Modal, Button } from "antd";
import { useRouter } from "next/router";

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
      router.push(`/em?view=private&&serieId=${serieId}&page=1`);
    else router.push(`/em?view=public&&serieId=${serieId}&page=1`);
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
          <img src="/icons/em/pending.svg" />
        </div>
        <div className={`${style["modal-msg"]}`}>
          <span className={`${style["nft-name"]}`}>{episodeName}</span> is being{" "}
          {type === "publish" ? <span>published</span> : <span>privated</span>}.
          <div>You will get a notification when it is completed.</div>
        </div>
        <div className={`${style["footer"]}`}>
          <Button className={`${style["active-btn"]}`} onClick={movetToHome}>
            Go to Homepage
          </Button>
          <Button className={`${style["normal-btn"]}`} onClick={moveToEM}>
            Back to Episodes
          </Button>
        </div>
      </div>
    </Modal>
  );
};
