import style from "./read-err.module.scss";
import { useTranslation } from "next-i18next";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export const ReadError = ({ data, onWrapperClick = null }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const { episodeId } = router.query;
  const { serieId } = router.query;

  const backToNft = () => {
    router.push(`/nft?serieId=${serieId}&episodeId=${episodeId}`);
  };

  return (
    <div className={`${style["container"]}`} onClick={onWrapperClick}>
      <div className={`${style["box"]}`}>
        {data.forSale == 0 && (
          <div className={`${style["err-msg"]}`}>{t("common:soldout")}</div>
        )}
        <div className={`${style["nft-name"]}`}>
          <img src={"/icons/book.svg"} className={`${style["nft-icon"]}`}></img>
          <div className={`${style["serie-name"]}`}>{data?.name}</div>
          <div className={`${style["ep-name"]}`}>
            {" "}
            - Chapter {data?.chapter}
          </div>
        </div>
        <div className={`${style["nft-price"]}`}>
          <div className={`${style["price"]}`}>
            {data.price} {data.currency}
          </div>
          <div className={`${style["name"]}`}>{"/Edition"}</div>
        </div>
        <div className={`${style["nft-sale"]}`}>
          <div className={`${style["title"]}`}>{t("common:forSale")}:</div>
          <div className={`${style["name"]}`}>
            {data.forSale}/{data.total}
          </div>
        </div>

        {data.forSale > 0 && (
          <Button className={`${style["buy-btn"]}`} onClick={backToNft}>
            {t("common:read.goShop")}
          </Button>
        )}
      </div>
    </div>
  );
};
