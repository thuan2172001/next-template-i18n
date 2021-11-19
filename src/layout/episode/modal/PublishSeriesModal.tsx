import style from "./c-modal.module.scss";
import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { Modal, Divider, Button } from "antd";
import SeriesManagement from "../../../api/creator/series";
import { GetUserInfo } from "src/api/auth";

export const PublishSeriesModal = ({
  updateModalVisible,
  serieInfo,
  updateRefetch,
}) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const body = {
    type: "PUBLISH",
    serieId: serieInfo?.serieId,
  };

  const updateSeries = () => {
    setLoading(true);
    SeriesManagement.updateSeries({
      userInfo: GetUserInfo(),
      body: body,
    }).then((res) => {
      updateModalVisible({ data: false });
      updateRefetch();
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
          {t("common:smModal.confirmPublish")}
        </div>

        <div className={`${style["modal-message-publish"]}`}>
          {`${t("common:smModal.confirmPublish1")} `}
          <span className={`${style["name"]}`}>{serieInfo?.serieName}</span>
          {` ${t("common:smModal.confirmPublish2")}`}
        </div>
        <Divider className={`${style["divider"]}`} />

        <div className={`${style["modal-footer"]}`}>
          <Button
            disabled={loading}
            className={`${style["footer-btn"]}`}
            onClick={() => updateModalVisible({ data: false })}
          >
            {t("common:cancel")}
          </Button>
          <Button
            disabled={loading}
            loading={loading}
            className={`${style["footer-btn"]} ${style["save"]} ${style["ml-30"]}`}
            onClick={updateSeries}
          >
            {t("common:publishSeries")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
