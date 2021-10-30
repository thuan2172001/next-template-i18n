import React, { useEffect, useMemo, useState, useRef } from "react";
// import { EpisodeProduct } from "../../components/product-item/EpisodeProduct";
import { useTranslation } from "next-i18next";
import CustomerSerieAPI from "../../api/customer/serie";
import { Col, Row, Skeleton, Tooltip } from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import style from "./serie.module.scss";
import { BASE_URL } from "../../api/const";
import router from "next/router";
import { SeeMoreNoResult } from "@components/no-result/SeeMoreNoResult";
import { PageNavigation } from "@components/pagination";
import SeriesManagementAPI from "../../api/series-management/series-management";
import { GetUserInfo } from "src/api/auth";
import { EpisodeProduct } from "@components/product-item/EpisodeProduct";
import EpisodeManagementAPI from "../../api/episode-management/episode-management";
import Share from "@components/share-component/share";

const SerieTemplate = ({ serieId }) => {
    const { t } = useTranslation();
    const [serieData, setSerieData] = useState(null);
    const [episodeListComponent, setEpisodeList] = useState(null);
    const [tooltip, setTooltip] = useState("Copy link");
    const [serieInfoHeight, setSerieInfoHeight] = useState(0);
    const [serieInfoHeight2, setSerieInfoHeight2] = useState(0);
    const serieInfoRef = useRef(null);
    const contentRef = useRef(null);
    const [seeAll, setSeeAll] = useState(false);
    const [clickSeeAll, setClickSeeAll] = useState(false);
    const [lines, setLines] = useState(0);
    const [itemPerPage, setItemPerPage] = useState(30)
    const [page, setPage] = useState(1);
    const [isLogged, setIsLogged] = useState(false);
    const [clientType, setClientType] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [likes, setLikes] = useState(0);
    const [favorite, setFavorite] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const userInfo = GetUserInfo();

            if (userInfo["encryptedPrivateKey"] && userInfo["publicKey"]) {
                setIsLogged(true);

                setClientType(userInfo.role["role"]);
            } else {
                setIsLogged(false);

                setClientType("");
            }
        }
    }, []);

    const onClickFavorite = () => {
        // if (!isLogged) setModalVisible(true);

        favorite ?
            EpisodeManagementAPI.unlike({
                userInfo: GetUserInfo(),
                serieId: serieId,
            }).then((res) => {
                console.log(res);
                if (res.data == "success") {
                    setFavorite(false);
                    setLikes(likes - 1);
                }
            }) : EpisodeManagementAPI.like({
                userInfo: GetUserInfo(),
                serieId: serieId,
            }).then((res) => {
                console.log(res);
                if (res.data == "success") {
                    setFavorite(true);
                    setLikes(likes + 1);
                }
            })
    };

    useEffect(() => {
        CustomerSerieAPI.getSerieData({ serieId: serieId, userInfo: GetUserInfo() })
            .then((data) => {
                setSerieData(data);
                setLikes(data?.likes);
                setFavorite(data?.alreadyLiked);
                setSerieInfoHeight(serieInfoRef.current.clientHeight);
                setSerieInfoHeight2(contentRef.current.clientHeight);
                setLines(Math.trunc(serieInfoRef.current.clientHeight / 21));

                if (
                    serieInfoRef.current.clientHeight -
                    (serieInfoRef.current.clientHeight % 21) >
                    contentRef.current.clientHeight
                ) {
                    setSeeAll(false);
                    setClickSeeAll(true);
                } else {
                    setSeeAll(true);
                }
            })
            .catch((err) => {
                console.log({ err });
            });
    }, []);

    useMemo(() => {
        serieData &&
            setEpisodeList(
                serieData.episodes.slice((page - 1) * itemPerPage, page * itemPerPage).map((episode) => {
                    return <EpisodeProduct serieId={serieId} episode={episode} />;
                })
            );
    }, [serieData, page]);

    const shareToTwitter = () => {
        window.open(
            `https://twitter.com/intent/tweet?text=${BASE_URL}/serie/${serieData.serieId}`,
            "_blank"
        );
    };

    const shareToFacebook = () => {
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${BASE_URL}/serie/${serieData.serieId}`,
            "_blank"
        );
    };

    const [width, setWidth] = useState(window.innerWidth);
    const [firstInit, setFirstInit] = useState(true);

    const dynamicHeight = {
        height:
            serieInfoHeight - (serieInfoHeight % 21) < serieInfoHeight2
                ? serieInfoHeight - (serieInfoHeight % 21)
                : serieInfoHeight2,
        WebkitLineClamp: lines,
    };

    useEffect(() => {
        function handleResize() {
            setWidth(window.innerWidth);
            setFirstInit(false);
        }

        setSerieInfoHeight(serieInfoRef.current.clientHeight);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [width]);

    return (
        <div className={`${style["serie-content"]}`}>
            <section
                className={`${style["image-cover-hidden"]} ${style["image-place"]}`}
            >
                <img src={serieData?.cover} width="100%" height="auto" />
            </section>
            <section className={`${style["serie-info"]}`}>
                <div className={`${style["about"]}`} ref={serieInfoRef}>
                    <Skeleton loading={!serieData?.serieName && serieData?.serieName != ""}>
                        <div className={`${style["name"]}`}>{serieData?.serieName}</div>
                    </Skeleton>
                    <Skeleton
                        loading={
                            !serieData?.episodes?.length && serieData?.episodes?.length != 0
                        }
                    >
                        <div className={`${style["small-detail"]}`}>
                            <div className={`${style["number"]}`}>
                                {`${serieData?.episodes?.length}
                                ${serieData?.episodes?.length > 1
                                        ? t(`common:items`)
                                        : t(`common:item`)
                                    }`}
                            </div>
                            <div className={`${style["vertical-line"]}`} />
                            <div
                                className={`${style["heart"]}`}
                                onClick={() => onClickFavorite()}
                            >
                                {favorite ? (
                                    <HeartFilled
                                        className={`${style["favorite-icon"]} ${style["color-red"]}`}
                                    />
                                ) : (
                                    <HeartOutlined className={`${style["favorite-icon"]}`} />
                                )}
                                <span className={`${style["like-count"]}`}>{likes}</span>
                            </div>
                        </div>
                        <div className={`${style["category-info"]}`}>
                            <span className={`${style["cate-item"]}`}>
                                {serieData?.category.categoryName}
                            </span>
                            {/*{serieData?.category?.map((category) => {*/}
                            {/*  return (*/}
                            {/*    <span className={`${style["cate-item"]}`}>*/}
                            {/*      {category.name}*/}
                            {/*    </span>*/}
                            {/*  );*/}
                            {/*})}*/}
                        </div>
                    </Skeleton>
                    <div className={` ${style["bottom-detail"]}`}>
                        <Row>
                            <Share episodeId={serieId} thumbnail={serieData?.thumbnail} />
                        </Row>
                    </div>
                </div>

                <Skeleton loading={!serieData?.description && serieData?.description != ""}>
                    <div
                        className={`${style["long-description-container"]} ${seeAll && style["see-all"]
                            }`}
                    >
                        <div
                            style={dynamicHeight}
                            className={`${style["long-description"]} ${style["detail"]} ${seeAll && style["see-all"]
                                }`}
                        >
                            <p ref={contentRef}>{`${serieData?.description}`}</p>
                        </div>
                        {!clickSeeAll && (
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

            {/*{modalVisible && (*/}
            {/*  <RequireLoginModal updateModalVisible={() => setModalVisible(false)} />*/}
            {/*)}*/}

            {serieData?.episodes.length === 0 ? (
                <SeeMoreNoResult />
            ) : (
                <div>
                    <section className={style["serie-info"]}>
                        <div className={style["episode-list-container"]}>
                            {episodeListComponent}
                        </div>
                    </section>
                    <PageNavigation
                        totalItem={serieData?.episodes.length}
                        itemsPerPage={itemPerPage}
                        page={page}
                        setPage={setPage}
                    />
                </div>
            )}
        </div>
    );
};

export default SerieTemplate;
