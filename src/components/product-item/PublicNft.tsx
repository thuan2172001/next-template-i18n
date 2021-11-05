import style from "./nft-product.module.scss";
import { convertLongString } from "src/utils/common-function";
import { Menu, Dropdown, Tooltip } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

export const PublicNft = ({ episode }) => {
  const isFree = episode?.price == 0;

  const { t } = useTranslation();
  const route = useRouter();
  
  const moveToNft = () => {
    route.push(`/episode?serieId=${episode.serie}&&episodeId=${episode._id}`);
  };

  const menu = (
    <Menu className={`${style["dropdown-menu"]}`}>
      <Menu.Item key="unpublish" onClick={moveToNft}>
        <span className={`${style["dropdown-item"]}`}>
          {t(`common:episode-management.privateEpisode`)}
        </span>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={`${style["nft-item"]}`}>
      <div className={`${style["cursor_pointer"]}`}>
        <img
          src={episode?.thumbnail}
          className={`${style["image"]}`}
          onClick={moveToNft}
        />
        <span className={`${style["nft-name"]}`}>
          <Tooltip title={episode?.name}>
            <div className={`${style["name"]}`} onClick={moveToNft}>
              {convertLongString(episode?.name, 14)}
            </div>
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
        </span>
      </div>

      {isFree ? (
        <div className={`${style["free"]}`}>{t("common:free")}</div>
      ) : (
        <>
          <div className={`${style["price"]}`}>
            {episode?.price + " " + episode?.currency}
          </div>
          <div className={`${style["quantity"]}`}>
            <div className={`${style["detail"]}`}>
              <img
                src="/assets/icons/nft-product-item/world.svg"
                className={`${style["icon"]}`}
              />
              <span>
                {episode?.forSale + "/" + (episode?.total - episode?.inventory)}
              </span>
            </div>
            <div className={`${style["detail"]} ${style["right-detail"]}`}>
              <img
                src="/assets/icons/nft-product-item/shelf.svg"
                className={`${style["icon"]}`}
              />
              <span>{episode?.inventory + "/" + episode?.total}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
