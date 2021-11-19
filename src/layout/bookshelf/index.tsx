import style from "./bookshelf.module.scss";
import { PageNavigation } from "@components/pagination";
import React, { useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import { BookshelfProduct } from "@components/product-item/BookshelfProduct";
import Head from "next/head";

export const BookshelfTemplate = ({ episodeList, totalEpisode, page, setPage}) => {
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
          {t("common:bookshelf.bookShelf")}
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
