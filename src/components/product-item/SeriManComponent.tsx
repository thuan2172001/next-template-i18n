import style from "./serie-mana-item.module.scss";
import { Button, Dropdown, Tooltip, Menu } from "antd";
import { PlusOutlined, MoreOutlined } from "@ant-design/icons";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import serie from "../../api/customer/serie";

export const SerieManagementComponent = ({
  type = "public",
  series,
  updateChosenSeries,
  updateModalType,
  updateModalVisible,
  showErrMsg = null,
  shopOpening,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const menu = (
    <Menu className={`${style["dropdown-menu"]}`}>
      <Menu.Item
        key="edit"
        onClick={() => router.push(`creator/edit_serie?serieId=${series._id}`)}
      >
        <span>{t("common:seriesManagement.dropDown.editSeries")}</span>
      </Menu.Item>
      {type === "private" ? (
        <Menu.Item
          key="publish"
          onClick={() => {
            if (!shopOpening) showErrMsg();
            else {
              updateChosenSeries({ data: series });
              updateModalType({ data: "publish" });
              updateModalVisible({ data: true });
            }
          }}
        >
          <span>{t("common:seriesManagement.dropDown.publishSeries")}</span>
        </Menu.Item>
      ) : (
        <Menu.Item
          key="private"
          onClick={() => {
            updateChosenSeries({ data: series });
            updateModalType({ data: "private" });
            updateModalVisible({ data: true });
          }}
        >
          <span>{t("common:seriesManagement.dropDown.privateSeries")}</span>
        </Menu.Item>
      )}
    </Menu>
  );

  const handleMoveToEm = () => {
    router.push(`/em?view=public&&serieId=${series._id}`);
  };

  return (
    <div className={`${style["container"]}`}>
      <div className={`${style["image-container"]}`} onClick={handleMoveToEm}>
        <img src={series?.thumbnail} className={`${style["image-place"]}`} />
      </div>

      <div className={`${style["detail"]}`}>
        <div className={`${style["serie-name"]}`}>
          <Tooltip title={series?.serieName}>
            <span onClick={handleMoveToEm}>{series?.serieName}</span>
          </Tooltip>
          <div style={{ marginLeft: "auto" }}>
            <Dropdown
              overlay={menu}
              trigger={["click"]}
              placement="bottomRight"
            >
              <MoreOutlined className={`${style["more-icon"]}`} />
            </Dropdown>
          </div>
        </div>
        <div className={`${style["sub-detail"]}`}>
          <div>
            {t("common:seriesManagement.create")}:{" "}
            {new Date(series?.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
          <div>
            {t("common:seriesManagement.update")}:{" "}
            {new Date(series?.updatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
          <div>
            {t("common:episode")}: {series?.episodes}
          </div>
        </div>
        <Button
          className={`${style["add-ep-btn"]}`}
          onClick={() => {
            router.push(`/creator/create_episode?serie=${series.serieId}`);
          }}
        >
          <PlusOutlined className={`${style["btn-icon"]}`} />
          {t("common:seriesManagement.addItem")}
        </Button>
      </div>
    </div>
  );
};
