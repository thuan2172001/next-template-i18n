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
  const [containerWidth, setContainerWidth] = useState(0);
  const [itemsPerLine, setItemsPerLine] = useState(0);
  const [itemsPagination, setItemsPagination] = useState(0);
  const [page, setPage] = useState(1);
  const [prevPage, setPrevPage] = useState(1);
  const [refetch, setRefetch] = useState(true);
  const [firstItemIndex, setFirstItemIndex] = useState(0);
  const [dataListProducts, setDataListProducts] = useState(null);
  const [category, setCategory] = useState(router.query["category"]);

  useEffect(() => {
    const element = document.getElementById("main-container");
    setContainerWidth(element.clientWidth);
    setItemsPerLine((element.clientWidth + 30) / 190);
    setItemsPagination((element.clientWidth + 30) / 190);
  }, []);

  useEffect(() => {
    if (prevPage < page) {
      setFirstItemIndex(firstItemIndex + itemsPerLine * 10 * (page - prevPage));
      setItemsPerLine((containerWidth + 30) / 190);
      setItemsPagination((containerWidth + 30) / 190);
      setPrevPage(page);
    } else if (prevPage > page) {
      const newFirstIndex =
        firstItemIndex - itemsPerLine * 10 * (prevPage - page);
      setFirstItemIndex(newFirstIndex > 0 ? newFirstIndex : 0);
      setPrevPage(page);
    }
    setRefetch(!refetch);
  }, [page]);

  useEffect(() => {
    router.isReady && setCategory(router.query.category);
  }, [router]);

  useEffect(() => {
    featDataListProducts(selectedCate);
  }, [category, refetch, selectedCate]);

  const featDataListProducts = (selectedCate) => {
    if (itemsPerLine <= 0) return;
    setIsLoading(true);
    SeriesManagementAPI.getSerieQuery({
      userInfo: GetUserInfo(),
      limit: 20,
      page: page,
      firstIndex: firstItemIndex,
      category: selectedCate,
      isDaily: "true",
    })
      .then((res) => {
        console.log({ res })
        setDataListProducts(res);
        setTotalProduct(res.length);
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
          {!isLoading && totalProduct > itemsPagination * 10 && (
            <PageNavigation
              page={page}
              setPage={setPage}
              totalItem={totalProduct}
              itemsPerPage={itemsPagination * 10}
            />
          )}
        </>
      )}
    </div>
  );
};
