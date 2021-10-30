import React, { useState, useEffect } from "react";
import style from "./list-products.module.scss";
import { SeeMoreNoResult } from "@components/no-result/SeeMoreNoResult";
import { PageNavigation } from "@components/pagination";
import { SerieComponent } from "@components/serie_component";
import SeriesManagementAPI from "../../api/series-management/series-management";
import { GetUserInfo } from "../../api/auth";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

export const ListProducts = ({ selectedCate }) => {
  const router = useRouter();
  const { t } = useTranslation();

  const [totalProduct, setTotalProduct] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(30);
  const [page, setPage] = useState(1);
  const [dataListProducts, setDataListProducts] = useState(null);
  const [category, setCategory] = useState(router.query["category"]);

  useEffect(() => {
    router.isReady && setCategory(router.query.category);
  }, [router]);

  useEffect(() => {
    featDataListProducts(selectedCate);
  }, [category, page, selectedCate, itemsPerPage]);

  const featDataListProducts = (selectedCate) => {
    setIsLoading(true);
    SeriesManagementAPI.getSerieQuery({
      userInfo: GetUserInfo(),
      limit: itemsPerPage,
      page: page,
      category: selectedCate,
      isDaily: "true",
    })
      .then((res) => {
        console.log({ res })
        setDataListProducts(res.data);
        setTotalProduct(res.totalSeries);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setTotalProduct(0);
        setIsLoading(false);
      });
  };

  return (
    <div className={style["list-series-container"]} id="main-container">
      <div className={`${style["list-series-tag"]}`}>
        {t("common:topPage.newRelease")}
      </div>
      {!isLoading && totalProduct === 0 ? (
        <SeeMoreNoResult />
      ) : (
        <>
          <div className={`${style["list-series-content"]}`}>
            {!isLoading &&
              dataListProducts?.map((serie, index) => (
                <SerieComponent
                  key={index}
                  serie={serie}
                  displayAuthor={false}
                />
              ))}
          </div>
          {!isLoading && totalProduct > itemsPerPage && (
            <PageNavigation
              page={page}
              setPage={setPage}
              totalItem={totalProduct}
              itemsPerPage={itemsPerPage}
            />
          )}
        </>
      )}
    </div>
  );
};
