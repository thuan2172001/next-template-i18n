import style from "./series-management.module.scss";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Row, Col } from "antd";
import { useTranslation } from "next-i18next";
import { SerieManagementComponent } from "@components/product-item/SeriManComponent";
import SeriesManagementAPI from "../../api/series-management/series-management";
import { GetUserInfo } from "src/api/auth";
import { PageNavigation } from "@components/pagination";
import { SeeMoreNoResult } from "@components/no-result/SeeMoreNoResult";

export const SeriesManagementTemplate = () => {
  const { t } = useTranslation();

  const router = useRouter();

  const [listType, setListType] = useState(router?.query.view);
  const [total, setTotal] = useState(0);
  const [series, setSeries] = useState([]);
  const [publicAmount, setPublicAmount] = useState(0);
  const [privateAmount, setPrivateAmount] = useState(0);

  const [firstItemIndex, setFirstItemIndex] = useState(0);
  const [page, setPage] = useState(1);

  const [itemsPerLine, setItemsPerLine] = useState(2);
  const [itemsPagination, setItemsPagination] = useState(2);
  const [prevPage, setPrevPage] = useState(1);
  const [refetch, setRefetch] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [chosenSeries, setChosenSeries] = useState(null);

  useEffect(() => {
    if (prevPage < page) {
      setFirstItemIndex(firstItemIndex + itemsPerLine * 10 * (page - prevPage));
      setItemsPerLine(2);
      setItemsPagination(2);
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
    if (router.isReady) setListType(router?.query.view);
  }, [router]);

  const [shopOpening, setShopOpening] = useState(true);

  useEffect(() => {
    SeriesManagementAPI.getSerieQuery({
      limit: itemsPerLine * 10,
      page: page,
      category: "all",
      isDaily: "true",
      userInfo: GetUserInfo(),
      firstIndex: firstItemIndex,
      isPublished: listType == "public"
    })
      .then((res) => {
        if (res.data) {
          setShopOpening(res.shopOpening);
          if (listType === "public") setTotal(res.publishedSeriesTotal);
          else setTotal(res.unpublishedSeries);
          setSeries(res?.data);
          setPublicAmount(res.publishedSeriesTotal);
          setPrivateAmount(res.unpublishedSeries);
        }
      })
      .catch();
  }, [listType, refetch]);

  const handleViewType = (type) => {
    switch (type) {
      case "public":
        router.push({
          pathname: "/sm",
          query: { ...router.query, view: "public" },
        });
        break;
      case "private":
        router.push({
          pathname: "/sm",
          query: { ...router.query, view: "private" },
        });
        break;
    }
  };

  const TabLayOut = () => {
    return (
      <>
        <div className={`${style["tab-layout"]}`}>
          <Button
            className={`${style["tab-btn"]} ${
              listType === "public" && style["active"]
            }`}
            onClick={() => handleViewType("public")}
          >
            <div>{t("common:episodeManagement.public")}</div>
            <div
              className={`${style["number-item"]} ${
                listType === "public" && style["number-item-active"]
              }`}
            >
              {publicAmount}
            </div>
          </Button>
          <Button
            className={`${style["tab-btn"]} ${
              listType === "private" && style["active"]
            }`}
            onClick={() => handleViewType("private")}
          >
            <div>{t("common:episodeManagement.private")}</div>
            <div
              className={`${style["number-item"]} ${
                listType === "private" && style["number-item-active"]
              }`}
            >
              {privateAmount}
            </div>
          </Button>
          <Button
            className={`${style["create-ep-btn"]}`}
            onClick={() => router.push("/creator/create_serie")}
          >
            <img
              src="/assets/icons/add.svg"
              className={`${style["button-icon"]}`}
            />
            {t("common:seriesManagement.createNewSeries")}
          </Button>
        </div>
      </>
    );
  };

  const [showErrMsg, setShowErrMsg] = useState(false);

  const ListSerie = () => {
    return (
      <Row gutter={[30, 30]}>
        {series?.map((serie, index) => (
          <Col span={12} key={index}>
            <SerieManagementComponent
              type={serie.isPublished ? "public" : "private"}
              series={serie}
              updateChosenSeries={({ data }) => {
                setChosenSeries(data);
              }}
              updateModalType={({ data }) => {
                setModalType(data);
              }}
              updateModalVisible={({ data }) => {
                setModalVisible(data);
              }}
              showErrMsg={() => {
                setShowErrMsg(true);
              }}
              shopOpening={shopOpening}
            />
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <div>
      {showErrMsg && (
        <div className={`${style["error-msg"]}`}>
          <img src="/assets/icons/invalid.svg" height={24} width={24} />
          <div className={`${style["error-content"]}`}>
            Please open shop in Shop setting before public series
          </div>
        </div>
      )}
      {showErrMsg && <div style={{ height: 50 }}></div>}
      <TabLayOut />

      {total > 0 && (
        <div
          className={`${style["list-serie-conatainer"]}`}
          id="main-container"
        >
          <ListSerie />
        </div>
      )}

      {listType === "public" && total === 0 && (
        <SeeMoreNoResult
          message={t("common:series-management.noPublicSerie")}
        />
      )}

      {listType === "private" && total === 0 && (
        <SeeMoreNoResult
          message={t("common:series-management.noPrivateSerie")}
        />
      )}

      {total > itemsPagination * 10 && (
        <PageNavigation
          className="background-gray"
          page={page}
          setPage={setPage}
          totalItem={total}
          itemsPerPage={itemsPagination * 10}
        />
      )}
    </div>
  );
};
