import { useState } from "react";
import { Radio, Modal, Space } from "antd";
import CreatorManageAPI from "../../api/creator/usermanagement";
import { GetUserInfo } from "src/api/auth";
import { useTranslation } from "react-i18next";
import style from './user-management.module.scss';

export const UserManagementModal = ({
  visble,
  userId,
  setModalType,
  userStatus,
  setUserStatus,
  refetchData,
}) => {
  const [value, setValue] = useState(userStatus);
  const {t} = useTranslation();

  const updateModal = (e) => {
    setValue(e.target.value);
  };

  const handleUpdate = () => {      
    CreatorManageAPI.toggleBanUser({
      userInfo: GetUserInfo(),
      body: {
        userId: userId,
        type: value.toLowerCase() === "active" ? "UNBAN_USER" : "BAN_USER",
      },
    })
      .then((data) => {
        refetchData();
        setModalType("");
        setUserStatus(value);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Modal
      visible={visble}
      okText={`Update`}
      closable={true}
      onCancel={() => setModalType("")}
      cancelButtonProps={{ style: { display: "none" } }}
      onOk={handleUpdate}
      width={300}
    >
      <Radio.Group onChange={updateModal} value={value}>
        <Space direction="vertical">
          <Radio className={style["option"]} value={"Active"}>{t("common:manageUsers.active")}</Radio>
          <Radio className={style["option"]} value={"Inactive"}>{t("common:manageUsers.inactive")}</Radio>
        </Space>
      </Radio.Group>
    </Modal>
  );
};
