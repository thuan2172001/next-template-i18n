import style from "./favorItem.module.scss";
import { PageNavigation } from "@components/pagination";
import React, { useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import { BookshelfProduct } from "@components/product-item/BookshelfProduct";
import Head from "next/head";
import { Skeleton } from "antd";

export const FavorPageTemplate = ({ episodeList, totalEpisode, page, setPage, loading }) => {
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
      <Head>
        <title>WebtoonZ | {t("common:favorItem.header")}</title>
      </Head>
      <div className={`${style["header"]}`}>
        <div className={`${style["header-name"]}`}>
          {t("common:favorItem.header")}
        </div>
      </div>
      <Skeleton loading={loading} paragraph={true}>
        <div className={`${style["item-list"]}`}>{episodeListComponent}</div>
        {totalEpisode > itemsPagination && (
          <PageNavigation
            totalItem={totalEpisode}
            itemsPerPage={itemsPagination}
            page={page}
            setPage={setPage}
          />
        )}
      </Skeleton>
    </div>
  );
};
