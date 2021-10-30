import style from "./favorItem.module.scss";
import { useTranslation } from "next-i18next";

export const EmptyFavorItem = () => {
  const { t } = useTranslation();
  
  return (
    <div className={`${style["empty-bookshelf"]}`}>
      <img src={"/assets/icons/no-result.svg"} />
      <span className={`${style["no-item"]}`}>
        {t("common:favorItem.noItem")}
      </span>
    </div>
  );
};
