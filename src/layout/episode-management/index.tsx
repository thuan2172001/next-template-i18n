import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "next-i18next";
import style from "./episode-management.module.scss";
import { useRouter } from "next/router";
import { GetUserInfo } from "src/api/auth";
import SeriesManagementAPI from "../../api/creator/series";
import { Skeleton, Button } from "antd";
import { PageNavigation } from "@components/pagination";
import { HeartFilled } from "@ant-design/icons";
import { PublicNft } from "@components/product-item/PublicNft";
import { PrivateNft } from "@components/product-item/PrivateNft";
import { SeeMoreNoResult } from "@components/no-result/SeeMoreNoResult";
// import { PendingPrivateSerieModal } from "src/templates/serie-management/modal/PendingPrivateSerieModal";

const EpisodeManagementTemplate = ({ serieId, view, setRoleValid }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [serieData, setSerieData] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [serieInfoHeight, setSerieInfoHeight] = useState(0);
  const [serieInfoHeight2, setSerieInfoHeight2] = useState(0);
  const serieInfoRef = useRef(null);
  const contentRef = useRef(null);
  const [seeAll, setSeeAll] = useState(false);
  const [clickSeeAll, setClickSeeAll] = useState(false);

  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [likes, setLike] = useState(0);
  const [total, setTotal] = useState(0);

  //pagination
  const [page, setPage] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const [itemsPerLine, setItemsPerLine] = useState(0);
  const [itemsPagination, setItemsPagination] = useState(0);

  useEffect(() => {
    if (router.isReady) {
      const element = document.getElementById("main-container");
      setContainerWidth(element.clientWidth);
      setItemsPerLine((element.clientWidth + 16) / 176);
      setItemsPagination((element.clientWidth + 16) / 176);
    }
  }, [router.isReady]);

  const [prevPage, setPrevPage] = useState(1);
  const [refetch, setRefetch] = useState(true);

  useEffect(() => {
    if (prevPage < page) {
      setItemsPerLine((containerWidth + 16) / 176);
      setItemsPagination((containerWidth + 16) / 176);
      setPrevPage(page);
    } else if (prevPage > page) {
      const newFirstIndex =
      setPrevPage(page);
    }
    setRefetch(!refetch);
  }, [page]);

  useEffect(() => {
    router.isReady && setPage(parseInt(router.query.page.toString()));
  }, [router.isReady, router.query?.page]);

  const [isPrivating, setPrivating] = useState(false);

  useEffect(() => {
    console.log(serieData)
  }, [serieData])

  useEffect(() => {
    if (!serieId) return;
    SeriesManagementAPI.getAllEpisodes({
      userInfo: GetUserInfo(),
      isPublished: view === "public",
      limit: itemsPerLine * 10,
      page: page,
      seriesId: serieId
    })
      .then((res) => {
        const series= res;

        if (view === "public") setTotal(series?.publishedEpisodesTotal);
        else setTotal(series.privateEpisodesTotal);
        setEpisodes(res.episodes);
        setSerieData(series);
        setPrivating(series.isUnpublishPending);
        setLike(series.likes);
        setBgColor(series.bgColor);
        setSerieInfoHeight(serieInfoRef.current.clientHeight);
        if (
          serieInfoRef.current.clientHeight < contentRef.current.clientHeight
        ) {
          setSeeAll(true);
          setClickSeeAll(false);
        } else {
          setClickSeeAll(false);
        }
        setSerieInfoHeight2(contentRef.current.clientHeight);
        setLines(Math.trunc(serieInfoRef.current.clientHeight / 21));
      })
      .catch(() => {
        setRoleValid("false");
      });
  }, [serieId, view, refetch]);

  const [lines, setLines] = useState(0);

  const dynamicHeight = {
    height:
      serieInfoHeight - (serieInfoHeight % 21) < serieInfoHeight2
        ? serieInfoHeight - (serieInfoHeight % 21)
        : serieInfoHeight2,
    WebkitLineClamp: lines,
  };

  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    setSerieInfoHeight(serieInfoRef.current.clientHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [width]);

  const formatTotalLike = (likes) => {
    if (!likes) return 0;
    if (likes >= 1000000) return Math.floor(likes / 1000000) + "M";
    if (likes >= 1000) return Math.floor(likes / 1000) + "K";
    return likes;
  };

  const [listType, setListType] = useState(view);

  useEffect(() => {
    setListType(view);
  }, [view]);

  const handleViewType = (type) => {
    switch (type) {
      case "public":
        setPage(1);
        router.push({
          pathname: "/em",
          query: { ...router.query, view: "public", page: 1 },
        });
        break;
      case "private":
        setPage(1);
        router.push({
          pathname: "/em",
          query: { ...router.query, view: "private", page: 1 },
        });
        break;
    }
  };

  const TabLayOut = () => {
    return (
      <>
        <div className={`${style["serie-info"]}`}>
          <div
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
              {serieData?.publishedEpisodesTotal}
            </div>
          </div>
          <div
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
              {serieData?.privateEpisodesTotal}
            </div>
          </div>
          <Button
            className={`${style["create-ep-btn"]}`}
            onClick={() =>
              router.push(`/creator/create_episode?serie=${serieId}`)
            }
          >
            <img
              src="/assets/icons/add.svg"
              className={`${style["button-icon"]}`}
            />
            {t("common:episodeManagement.createNewEp")}
          </Button>
        </div>
        <div className={`${style["line-divider"]}`} />
      </>
    );
  };

  const EpisodeList = () => {
    return (
      <>
        {episodes &&
          episodes.map((episode, index) =>
            episode.isPublished ? (
              <div key={index}>
                <PublicNft episode={episode} />
              </div>
            ) : (
              <div key={index}>
                <PrivateNft episode={episode} />
              </div>
            )
          )}
      </>
    );
  };

  if (!router.isReady) return <div id="main-container"></div>;

  return (
    <div className={`${style["serie-content"]}`}>
      {/*{isPrivating && (*/}
      {/*  <PendingPrivateSerieModal*/}
      {/*    serieInfo={serieData}*/}
      {/*    updateModalType={({ type }) => console.log({ type })}*/}
      {/*  />*/}
      {/*)}*/}
      <section
        className={`${style["image-cover-hidden"]} ${style["image-place"]}`}
        style={{ backgroundColor: bgColor }}
      >
        <img src={serieData?.cover} width="960px" height="432px" />
      </section>
      <section className={`${style["serie-info"]}`}>
        <div className={`${style["about"]}`} ref={serieInfoRef}>
          <Skeleton loading={!serieData?.serieName && serieData?.serieName != ""}>
            <div className={`${style["name"]}`}>{serieData?.name}</div>
          </Skeleton>
          <Skeleton loading={!serieData?.totalEpisodes && serieData?.totalEpisodes != 0}>
            <div className={`${style["small-detail"]}`}>
              <div className={`${style["number"]}`}>
                {`${serieData?.totalEpisodes}
            ${serieData?.totalEpisodes > 1 ? t(`common:items`) : t(`common:item`)}`}
              </div>
              <div className={`${style["vertical-line"]}`} />
              <div className={`${style["heart"]}`}>
                <HeartFilled
                  className={`${style["favorite-icon"]} ${style["color-red"]}`}
                />
                <span className={`${style["like-count"]}`}>
                  {formatTotalLike(likes)}
                </span>
              </div>
            </div>
            <div className={`${style["category-info"]}`}>

                  <span className={`${style["cate-item"]}`}>
                    {serieData?.category.categoryName}
                  </span>
            </div>
          </Skeleton>
          {/*<div className={` ${style["bottom-detail"]}`}>*/}
            {/*<span className={`${style["serie-detail"]}`}>*/}
            {/*  {serieData?.createdBy?.avatar && (*/}
            {/*    <img*/}
            {/*      src={serieData?.createdBy?.avatar}*/}
            {/*      className={`${style["avatar-creator"]}`}*/}
            {/*    />*/}
            {/*  )}*/}
            {/*  <span className={`${style["serie-creator-name"]}`}>*/}
            {/*    {serieData?.createdBy?.user?.fullName}*/}
            {/*  </span>*/}
            {/*</span>*/}
          {/*  <div className={`${style["share-section"]}`}>*/}
          {/*    <span className={`${style["share-item"]}`}>*/}
          {/*      <img src={"/icons/share/share-link.svg"} />*/}
          {/*    </span>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>

        <Skeleton loading={!serieData?.description && serieData?.description != ""}>
          <div
            className={`${style["long-description-container"]} ${
              seeAll && style["see-all"]
            }`}
          >
            <div
              style={dynamicHeight}
              className={`${style["long-description"]} ${style["detail"]} ${
                seeAll && style["see-all"]
              }`}
            >
              <p ref={contentRef}>{`${serieData?.description}`}</p>
            </div>
            {!clickSeeAll && seeAll && (
              <span
                className={`${style["see-all-btn"]} ${style["cursor_pointer"]}`}
                onClick={() => {
                  setSeeAll(true);
                  setClickSeeAll(true);
                  setLines(1000);
                }}
              >
                See all
              </span>
            )}
          </div>
        </Skeleton>
      </section>

      <TabLayOut />
      <div className={`${style["serie-info"]} ${style["mt-45"]}`}>
        <div
          className={`${style["episode-list-container"]}`}
          id="main-container"
        >
          {total > 0 && <EpisodeList />}
        </div>
      </div>

      {listType === "public" && total === 0 && (
        <SeeMoreNoResult
          message={t("common:episode-management.noPublicResult")}
        />
      )}
      {listType === "private" && total === 0 && (
        <SeeMoreNoResult
          message={t("common:episode-management.noPrivateResult")}
        />
      )}

      {total > itemsPagination * 10 && (
        <PageNavigation
          page={page}
          setPage={(value) => {
            router.push({
              pathname: "/em",
              query: { ...router.query, page: value },
            });
          }}
          totalItem={total}
          itemsPerPage={itemsPagination * 10}
        />
      )}
    </div>
  );
};

export default EpisodeManagementTemplate;
