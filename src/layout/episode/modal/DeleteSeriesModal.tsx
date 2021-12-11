import style from "./c-modal.module.scss";
import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { Modal, Divider, Button } from "antd";
import SeriesManagement from "../../../api/creator/series";
import { GetUserInfo } from "src/api/auth";

export const DeleteSeriesModal = ({
  updateModalVisible,
  serieInfo,
  updateModalType = null,
  updateRefetch,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const deleteSeries = () => {
    setLoading(true);
    SeriesManagement.deleteSeries({
      userInfo: GetUserInfo(),
      serieId: serieInfo?.serieId,
    })
      .then((res) => {
        updateModalVisible({ data: false });
        updateModalType({ type: "success" });
        updateRefetch();
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
          {t("common:smModal.confirmDelete")}
        </div>
        <div className={`${style["modal-message-publish"]}`}>
          {`${t("common:smModal.confirmDelete1")} `}
          <span className={`${style["name"]}`}>{serieInfo?.serieName}</span>
          {` ${t("common:smModal.confirmDelete2")}`}
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
            onClick={deleteSeries}
            disabled={loading}
            loading={loading}
          >
            {t("common:smModal.deleteSeries")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
