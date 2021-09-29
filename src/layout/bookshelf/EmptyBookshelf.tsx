import style from "./bookshelf.module.scss";
import { Button } from "antd";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";


export const EmptyBookshelf = () => {
  const { t } = useTranslation();
  const router = useRouter();

  
  return (
    <div className={`${style["empty-bookshelf"]}`}>
      <img src={"/images/no-result.svg"} />
      <span className={`${style["no-item"]}`}>
        {t("common:bookshelf.noItem")}
      </span>
      <Button
        type="primary"
        className={`${style["continue-btn"]}`}
        onClick={() => router.push(`/`)}
      >
        {t("cart:emptyCart.continueBrowse")}
      </Button>
    </div>
  );
};
