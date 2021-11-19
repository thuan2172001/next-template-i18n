import style from "./favorItem.module.scss";
import { PageNavigation } from "@components/pagination";
import React, { useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import { BookshelfProduct } from "@components/product-item/BookshelfProduct";

export const FavorPageTemplate = ({ episodeList, totalEpisode, page, setPage}) => {
  const { t } = useTranslation();
  const itemsPagination = 30;
  const [episodeListComponent, setEpisodeList] = useState(null);

  useMemo(() => {
    episodeList &&
      setEpisodeList(
        episodeList
          .map((episode, index) => {
            return (
              <BookshelfProduct key={index} episode={episode} />
            );
          })
      );
  }, [episodeList]);

  return (
    <div className={`${style["cointainer"]}`} id="main-container">
      <div className={`${style["header"]}`}>
        <div className={`${style["header-name"]}`}>
          {t("common:favorItem.header")}
        </div>
      </div>
      <div className={`${style["item-list"]}`}>{episodeListComponent}</div>
      {totalEpisode > itemsPagination && (
        <PageNavigation
          totalItem={totalEpisode}
          itemsPerPage={itemsPagination}
          page={page}
          setPage={setPage}
        />
      )}
    </div>
  );
};
