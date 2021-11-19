import style from "./nft-product.module.scss";
import { convertLongString } from "src/utils/common-function";
import { Button, Tooltip } from "antd";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React from "react";

export const PrivateNft = ({ episode }) => {
  const isFree = episode?.price == 0;

  const { t } = useTranslation();
  const route = useRouter();

  const PrivateAction = () => {
    return (
      <div className={`${style["private-action"]}`}>
        <img
          src="/assets/icons/trash.svg"
          className={`${style["cursor_pointer"]}`}
          onClick={() => {
            window.localStorage.setItem("modalType", "request-burn");
            moveToNft();
          }}
        />
        <Button className={`${style["publish-btn"]}`} onClick={moveToNft}>
          <img
            src="/assets/icons/world-blue.svg"
            className={`${style["button-icon"]}`}
          />
          {t("common:publish")}
        </Button>
      </div>
    );
  };

  const moveToNft = () => {
    route.push(`/episode?serieId=${episode.serieId}&&episodeId=${episode.episodeId}`);
  };

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
              {convertLongString(episode?.name, 17)}
            </div>
          </Tooltip>
        </span>
      </div>

      {episode?.price === 0 ? (
        <div className={`${style["free"]}`}>{t("common:free")}</div>
      ) : (
        <>
          <div className={`${style["quantity"]}`}>
            <div className={`${style["detail"]}`}>
              <span>
                {episode?.price} USD
              </span>
            </div>
          </div>
        </>
      )}
      <PrivateAction />
    </div>
  );
};
