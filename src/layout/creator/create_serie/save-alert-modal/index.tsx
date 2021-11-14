import style from "./alert-modal.module.scss";
import { useTranslation } from "next-i18next";
import { Modal, Button } from "antd";
import { useRouter } from "next/router";

export const SaveAlertModal = ({
  updateModalVisible,
  pathname = "/sm?view=public",
}) => {
  const route = useRouter();
  const { t } = useTranslation();
  const handleLeave = () => {
    route.push(pathname);
  };
  return (
    <Modal
      visible={true}
      width={539}
      closable={false}
      maskClosable={false}
      centered={true}
      bodyStyle={{ padding: "24px 0px" }}
      footer={null}
    >
      <div className={`${style["modal-common"]}`}>
        <div className={`${style["modal-header"]}`}>
          <img src="/assets/icons/question.svg" />
        </div>

        <div className={`${style["modal-message"]}`}>
          {t("create-series:alertNotSave")}
        </div>

        <div className={`${style["modal-footer"]}`}>
          <Button className={`${style["footer-btn"]}`} onClick={handleLeave}>
            {t("common:leave")}
          </Button>
          <Button
            className={`${style["footer-btn"]} ${style["save"]}`}
            onClick={() => updateModalVisible()}
          >
            {t("common:cancel")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
