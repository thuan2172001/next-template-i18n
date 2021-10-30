import style from "./bookshelf.module.scss";
import { PageNavigation } from "@components/pagination";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import { BookshelfProduct } from "@components/product-item/BookshelfProduct";

export const BookshelfTemplate = ({ episodeList}) => {
  const { t } = useTranslation();

  const [containerWidth, setContainerWidth] = useState(0);
  const [itemsPerLine, setItemsPerLine] = useState(0);
  const [itemsPagination, setItemsPagination] = useState(0);

  useEffect(() => {
    const element = document.getElementById("main-container");
    setContainerWidth(element.clientWidth);
    setItemsPerLine((element.clientWidth + 30) / 190);
    setItemsPagination((element.clientWidth + 30) / 190);
  }, []);

  const [episodeListComponent, setEpisodeList] = useState(null);
  const [page, setPage] = useState(1);

  useMemo(() => {
    setItemsPerLine((containerWidth + 30) / 190);
    setItemsPagination((containerWidth + 30) / 190);
    episodeList &&
      setEpisodeList(
        episodeList
          .slice((page - 1) * itemsPerLine * 10, page * itemsPerLine * 10)
          .map((episode, index) => {
            return (
              <BookshelfProduct key={index} episode={episode} />
            );
          })
      );
  }, [episodeList, page]);

  return (
    <div className={`${style["cointainer"]}`} id="main-container">
      <div className={`${style["header"]}`}>
        <div className={`${style["header-name"]}`}>
          {t("common:bookshelf.bookShelf")}
        </div>
      </div>

      <div className={`${style["item-list"]}`}>{episodeListComponent}</div>
      {episodeList?.length > itemsPagination * 10 && (
        <PageNavigation
          totalItem={episodeList?.length}
          itemsPerPage={itemsPagination * 10}
          page={page}
          setPage={setPage}
        />
      )}
    </div>
  );
};
