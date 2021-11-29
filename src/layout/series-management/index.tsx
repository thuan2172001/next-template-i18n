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
import { PublishSeriesModal } from "src/layout/episode/modal/PublishSeriesModal";
import { PrivateSeriesModal } from "../episode/modal/PrivateSeriesModal";
import { SuccessPrivateSerieModal } from "./modal/SuccessPrivateSerieModal";
import { FailedPrivateSerieModal } from "./modal/FailedPrivateModal";
import Head from "next/head";

export const SeriesManagementTemplate = () => {
  const { t } = useTranslation();

  const router = useRouter();

  const [listType, setListType] = useState(router?.query.view);
  const [total, setTotal] = useState(-1);
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
  }, [router.isReady]);

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
          if (listType === "public") setTotal(res.publishedSeriesTotal);
          else setTotal(res.unpublishedSeries);
          setSeries(res?.data);
          setPublicAmount(res.publishedSeriesTotal);
          setPrivateAmount(res.unpublishedSeries);
        }
      })
      .catch(err => {
        setTotal(0);
      });
  }, [listType, refetch]);

  const handleViewType = (type) => {
    switch (type) {
      case "public":
        setListType("public")
        router.push({
          pathname: "/sm",
          query: { ...router.query, view: "public" },
        },
          undefined, { shallow: true }
        );
        break;
      case "private":
        setListType("private")
        router.push({
          pathname: "/sm",
          query: { ...router.query, view: "private" },
        },
          undefined, { shallow: true }
        );
        break;
    }
  };

  const TabLayOut = () => {
    return (
      <>
        <Head>
          <title>WebtoonZ | {t("common:seriesManagement.header")}</title>
        </Head>
        <div className={`${style["tab-layout"]}`}>
          <Button
            className={`${style["tab-btn"]} ${listType === "public" && style["active"]
              }`}
            onClick={() => handleViewType("public")}
          >
            <div>{t("common:episodeManagement.public")}</div>
            <div
              className={`${style["number-item"]} ${listType === "public" && style["number-item-active"]
                }`}
            >
              {publicAmount}
            </div>
          </Button>
          <Button
            className={`${style["tab-btn"]} ${listType === "private" && style["active"]
              }`}
            onClick={() => handleViewType("private")}
          >
            <div>{t("common:episodeManagement.private")}</div>
            <div
              className={`${style["number-item"]} ${listType === "private" && style["number-item-active"]
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
            />
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <div className={style["sm-container"]}>
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
      {modalVisible && modalType === "publish" ? (
        <PublishSeriesModal
          updateModalVisible={({ data }) => {
            setModalVisible(data);
          }}
          serieInfo={chosenSeries}
          updateModalType={({ type }) => setModalType(type)}
          updateRefetch={() => setRefetch(!refetch)}
        />
      ) : (
        modalVisible &&
        modalType === "private" && (
          <PrivateSeriesModal
            updateModalVisible={({ data }) => {
              setModalVisible(data);
            }}
            serieInfo={chosenSeries}
            updateModalType={({ type }) => setModalType(type)}
            updateRefetch={() => setRefetch(!refetch)}
          />
        )
      )}
      {modalType === "success" && (
        <SuccessPrivateSerieModal
          serieName={chosenSeries.name}
          updateModalType={({ type }) => setModalType(type)}
        />
      )}
      {modalType === "fail" && (
        <FailedPrivateSerieModal
          serieName={chosenSeries.name}
          updateModalType={({ type }) => setModalType(type)}
        />
      )}
    </div>
  );
};
