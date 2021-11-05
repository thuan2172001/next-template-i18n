import style from "./read-err.module.scss";
import { useTranslation } from "next-i18next";
import { Button } from "antd";
import { useRouter } from "next/router";

export const ReadError = ({ data, onWrapperClick = null }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const { episodeId } = router.query;
  const { serieId } = router.query;

  const backToNft = () => {
    router.push(`/episode?serieId=${serieId}&episodeId=${episodeId}`);
  };

  return (
    <div className={`${style["container"]}`} onClick={onWrapperClick}>
      <div className={`${style["box"]}`}>
        {data.forSale == 0 && (
          <div className={`${style["err-msg"]}`}>{t("common:soldout")}</div>
        )}
        <div className={`${style["nft-name"]}`}>
          <img src={"/assets/icons/book.svg"} className={`${style["nft-icon"]}`}></img>
          <div className={`${style["serie-name"]}`}>{data?.name}</div>
          <div className={`${style["ep-name"]}`}>
            {" "}
            - Chapter {data?.chapter}
          </div>
        </div>
        <div className={`${style["nft-price"]}`}>
          <div className={`${style["price"]}`}>
            {data?.price} $
          </div>
        </div>

        <Button className={`${style["buy-btn"]}`} onClick={backToNft}>
          {t("common:read.goShop")}
        </Button>
      </div>
    </div>
  );
};
