import style from "./c-modal.module.scss";
import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { Modal, Divider, Button } from "antd";
import SeriesManagement from "../../../api/creator/series";
import { GetUserInfo } from "src/api/auth";

export const PrivateSeriesModal = ({
  updateModalVisible,
  serieInfo,
  updateModalType = null,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const updateSeries = () => {
    setLoading(true);
    const body = {
      action: "unpublish",
      seriesId: serieInfo?._id,
    };

    updateModalType({ type: "pending" });

    SeriesManagement.updateSeries({
      userInfo: GetUserInfo(),
      body: body,
    })
      .then((res) => {
        console.log({ res });
        updateModalVisible({ data: false });
        res.result !== "pending" && updateModalType({ type: "success" });
      })
      .catch((err) => {
        updateModalType({ type: "fail" });
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
      onCancel={() => updateModalVisible({ data: false })}
      centered={true}
      bodyStyle={{ padding: "24px 0px" }}
      footer={null}
    >
      <div className={`${style["modal-common"]}`}>
        <div className={`${style["modal-header"]}`}>
          {t("common:smModal.confirmPrivate")}
        </div>
        <div className={`${style["modal-message-publish"]}`}>
          {`${t("common:smModal.confirmPrivate1")} `}
          <span className={`${style["name"]}`}>{serieInfo?.name}</span>
          {` ${t("common:smModal.confirmPrivate2")}`}
        </div>
        <Divider className={`${style["divider"]}`} />

        <div className={`${style["modal-footer"]}`}>
          <Button
            className={`${style["footer-btn"]}`}
            onClick={() => updateModalVisible({ data: false })}
            disabled={loading}
          >
            {t("common:cancel")}
          </Button>
          <Button
            className={`${style["footer-btn"]} ${style["ml-30"]}`}
            onClick={updateSeries}
            disabled={loading}
            loading={loading}
          >
            {t("common:smModal.privateSeries")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
