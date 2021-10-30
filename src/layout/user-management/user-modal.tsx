import { useState } from "react";
import { Radio, Modal, Space } from "antd";
import CreatorManageAPI from "../../api/creator/usermanagement";
import { GetUserInfo } from "src/api/auth";

export const UserManagementModal = ({
  visble,
  userId,
  setModalType,
  userStatus,
  setUserStatus,
  refetchData,
}) => {
  const [value, setValue] = useState(userStatus);

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
          <Radio value={"Active"}>Active</Radio>
          <Radio value={"Inactive"}>Inactive</Radio>
        </Space>
      </Radio.Group>
    </Modal>
  );
};
