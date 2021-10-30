import style from "./alert-modal.module.scss";
import { useTranslation } from "next-i18next";
import { Modal, Button } from "antd";
import { useRouter } from "next/router";

export const SaveAlertModal = ({
  updateModalVisible,
  pathname = "/sm?view=public",
}) => {
  const route = useRouter();
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
          <img src="/icons/question.svg" />
        </div>

        <div className={`${style["modal-message"]}`}>
          Changes you made will not be saved. Do you want to leave?
        </div>

        <div className={`${style["modal-footer"]}`}>
          <Button className={`${style["footer-btn"]}`} onClick={handleLeave}>
            Leave
          </Button>
          <Button
            className={`${style["footer-btn"]} ${style["save"]}`}
            onClick={() => updateModalVisible()}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
