import React, { useEffect, useState, useRef, useMemo } from "react";
import { useTranslation } from "next-i18next";
import { Button } from "antd";
import { HeartFilled } from "@ant-design/icons";
import style from "./preview.module.scss";
import { GetUserInfo } from "src/api/auth";
import { NoResult } from "./NoResult";
import { PageNavigation } from "@components/pagination";
import { EpisodeProduct } from "@components/product-item/EpisodeProduct";
import category from "src/api/category/category";

export const PreviewSerieTemplate = ({
  info = { title: "", summary: "", category: "" },
  setPreview,
  upload,
  editSeries = false,
  series = null,
  loading = false,
}) => {
  const { t } = useTranslation();
  const [width, setWidth] = useState(window.innerWidth);
  const creatorAvatar = localStorage.getItem("creatorAvatar");

  const [serieInfoHeight, setSerieInfoHeight] = useState(0);
  const [serieInfoHeight2, setSerieInfoHeight2] = useState(0);
  const serieInfoRef = useRef(null);
  const contentRef = useRef(null);
  const [seeAll, setSeeAll] = useState(false);
  const [clickSeeAll, setClickSeeAll] = useState(false);
  const [lines, setLines] = useState(0);
  const [clickCreate, setClickCreate] = useState(false);
  const [episodeListComponent, setEpisodeList] = useState(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [itemsPerLine, setItemsPerLine] = useState(0);
  const [itemsPagination, setItemsPagination] = useState(0);
  const [page, setPage] = useState(1);

  let author = GetUserInfo();

  const dynamicHeight = {
    height:
      serieInfoHeight - (serieInfoHeight % 21) < serieInfoHeight2
        ? serieInfoHeight - (serieInfoHeight % 21)
        : serieInfoHeight2,
    WebkitLineClamp: lines,
  };

  const FooterButton = () => {
    return (
      <div className={`${style["footer"]}`}>
        <Button
          className={`${style["button"]} ${style["cancel-button"]}`}
          onClick={() => {
            !clickCreate && setPreview(false);
          }}
          disabled={clickCreate}
        >
          {t("create-series:createNft.continueEditing")}
        </Button>
        <Button
          loading={loading}
          className={`${style["button"]} ${style["active-save"]} ${style["confirm-button"]}`}
          onClick={() => {
            upload();
            setClickCreate(true);
          }}
          disabled={clickCreate}
        >
          {editSeries
            ? t("create-series:updateSeries")
            : t("create-series:createSeries")}
        </Button>
      </div>
    );
  };

  useEffect(() => {
    setSerieInfoHeight(serieInfoRef.current.clientHeight);
    if (serieInfoRef.current.clientHeight < contentRef.current.clientHeight) {
      setSeeAll(true);
      setClickSeeAll(false);
    } else {
      setSeeAll(false);
      setClickSeeAll(false);
    }
    setSerieInfoHeight2(contentRef.current.clientHeight);
    setLines(Math.trunc(serieInfoRef.current.clientHeight / 21));
  }, []);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    setSerieInfoHeight(serieInfoRef.current.clientHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [width]);

  useMemo(() => {
    if (series) {
      setItemsPerLine((containerWidth + 16) / 176);
      setItemsPagination((containerWidth + 16) / 176);

      series.episodes.slice(
        (page - 1) * itemsPerLine * 10,
        page * itemsPerLine * 10
      );
      series &&
        setEpisodeList(
          series.episodes
            .slice((page - 1) * itemsPerLine * 10, page * itemsPerLine * 10)
            .map((episode, index) => {
              return (
                <EpisodeProduct
                  key={index}
                  serieId={series._id}
                  episode={episode}
                />
              );
            })
        );
    }
  }, [series, page, containerWidth]);

  window.onload = () => {
    const element = document.getElementById("main-container");
    setContainerWidth(element.clientWidth);
    setItemsPerLine((element.clientWidth + 16) / 176);
    setItemsPagination((element.clientWidth + 16) / 176);
  };

  useEffect(() => {
    if (editSeries) {
      const element = document.getElementById("main-container");
      setContainerWidth(element.clientWidth);
      setItemsPerLine((element.clientWidth + 16) / 176);
      setItemsPagination((element.clientWidth + 16) / 176);
    }
  }, [editSeries]);

  const formatTotalLike = (likes) => {
    if (!likes) return 0;
    if (likes >= 1000000) return Math.floor(likes / 1000000) + "M";
    if (likes >= 1000) return Math.floor(likes / 1000) + "K";
    return likes;
  };

  return (
    <div className={`${style["serie-content"]}`}>
      <section
        className={`${style["image-cover-hidden"]} ${style["image-place"]}`}
      >
        <img
          src={window.localStorage.getItem("cover-url")}
          width="100%"
          height="auto"
        />
      </section>
      <section className={`${style["serie-info"]}`}>
        <div className={`${style["about"]}`} ref={serieInfoRef}>
          <div className={`${style["name"]}`}>{info?.title}</div>
          <div className={`${style["small-detail"]}`}>
            <div className={`${style["number"]}`}>
              {series ? series.episodes.length : 0} {t("common:cartItem.item")}
            </div>
            <div className={`${style["vertical-line"]}`} />
            <div className={`${style["heart"]}`}>
              <HeartFilled
                className={`${style["favorite-icon"]} ${style["color-red"]}`}
              />
              <span className={`${style["like-count"]}`}>
                {series ? formatTotalLike(series.totalLikes) : 1}
              </span>
            </div>
          </div>
          <div className={`${style["category-info"]}`}>
            <span className={`${style["cate-item"]}`}>{t(`common:category.${info?.category}`)}</span>
          </div>
          <div className={` ${style["bottom-detail"]}`}>
            <span className={`${style["serie-detail"]}`}>
              {author ? (
                <img
                  src={creatorAvatar}
                  className={`${style["avatar-creator"]}`}
                />
              ) : (
                <></>
              )}
              <span className={`${style["serie-creator-name"]}`}>
                {author?.fullName}
              </span>
            </span>
            <div className={`${style["share-section"]}`}>
              <span className={`${style["share-item"]}`}>
                <img src={"/assets/icons/share/share-link.svg"} />
              </span>
            </div>
          </div>
        </div>

        <div
          className={`${style["long-description-container"]} ${seeAll && style["see-all"]
            }`}
        >
          <div
            style={dynamicHeight}
            className={`${style["long-description"]} ${style["detail"]} ${seeAll && style["see-all"]
              }`}
          >
            <p className={`${style["serie-summary"]}`} ref={contentRef}>
              {info?.summary}
            </p>
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
      </section>

      {(!editSeries || series?.episodes.length === 0) && (
        <NoResult message={t("create-series:noItem")} />
      )}

      {editSeries && series?.episodes.length > 0 && (
        <div>
          <section className={style["serie-info"]} id="main-container">
            <div className={style["episode-list-container"]}>
              {episodeListComponent}
            </div>
          </section>
          {series?.episodes.length > itemsPagination * 10 && (
            <PageNavigation
              totalItem={series?.episodes.length}
              itemsPerPage={itemsPagination * 10}
              page={page}
              setPage={setPage}
            />
          )}
        </div>
      )}
      <FooterButton />
    </div>
  );
};

export default PreviewSerieTemplate;
