import React, { useEffect, useState } from "react";
import { Tooltip } from "antd";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import style from "./serie-template.module.scss";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { convertLongString } from "src/utils/common-function";
import SeriesManagementAPI from "../../api/series-management/series-management";
import { GetUserInfo } from "src/api/user";

export const SerieComponent = ({
  serie,
  classNames = "",
  displayAuthor = true,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [isLogged, setIsLogged] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userInfo = GetUserInfo();

      if (userInfo["encryptedPrivateKey"] && userInfo["publicKey"]) {
        setIsLogged(true);
        setRole(userInfo["role"].role);
      } else {
        setIsLogged(false);
      }
    }
  }, []);

  const { isLiked } = serie;

  const [data, setData] = useState({
    creatorName: 'Thuan',
    // creatorAvatar: "",
    // likes: serie.totalLikes,
    serieName: serie.serieName,
    thumbanailSrc: serie.thumbnail,
  });

  const [favorite, setFavorite] = useState(isLiked);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const initialData = {
      creatorName: 'Thuan',
      // creatorAvatar: serie.createdBy.avatar,
      // likes: serie.totalLikes,
      serieName: serie.serieName,
      thumbanailSrc: serie.thumbnail,
    };
    setData(initialData);
  }, [serie]);

  const onClickFavorite = () => {
    console.log(1);
  };

  const handleMoveToShop = () => {
    router.push(`/shop/${serie.createdBy._id}`);
  };

  const handleRouteForEm = () => {
    if (role !== "creator") router.push(`/serie/${serie.serieId}`);
    else router.push(`/em?view=public&&serieId=${serie.serieId}`);
  };

  if (!displayAuthor)
    return (
      <>
        <div className={`${style["serie-component"]} ${style[classNames]}`}>
          <div className={`${style["cursor_pointer"]}`}>
            <img
              src={data.thumbanailSrc}
              className={`${style["serie-image"]}`}
              onClick={handleRouteForEm}
            />
            <div
              className={`${style["cursor_pointer"]} ${style["bottom-detail"]} ${style["flex-end"]}`}
            >
              <Tooltip title={data.serieName}>
                <div
                  className={`${style["serie-name"]}`}
                  onClick={handleRouteForEm}
                >
                  {convertLongString(data.serieName, 22)}
                </div>
              </Tooltip>

              <span
                className={`${style["float-right"]} ${style["serie-heart"]}`}
              >
                {favorite ? (
                  <HeartFilled
                    className={`${style["favorite-icon"]} ${style["color-red"]}`}
                    onClick={onClickFavorite}
                  />
                ) : (
                  <HeartOutlined
                    className={`${style["favorite-icon"]}`}
                    onClick={onClickFavorite}
                  />
                )}

              </span>
            </div>
          </div>
        </div>
      </>
    );

  return (
    <>
      <div className={`${style["serie-component"]} ${style[classNames]}`}>
        <div
          onClick={handleRouteForEm}
          className={`${style["cursor_pointer"]}`}
        >
          <img src={data.thumbanailSrc} className={`${style["serie-image"]}`} />
          <Tooltip title={data.serieName}>
            <div className={`${style["serie-name"]}`}>
              {convertLongString(data.serieName, 22)}
            </div>
          </Tooltip>
        </div>

        <div className={`${style["cursor_pointer"]} ${style["bottom-detail"]}`}>
          <span
            className={`${style["serie-detail"]}`}
            onClick={handleMoveToShop}
          >
            {/* {data.creatorAvatar && (
              <img
                src={data.creatorAvatar}
                className={`${style["avatar-creator"]}`}
              />
            )} */}
            <span
              className={`${style["serie-creator-name"]} ${style["cursor_pointer"]}`}
            >
              <Tooltip title={data.creatorName}>
                <span
                  className={`${style["text-color-black"]} ${style["creator-name"]}`}
                >
                  {/* {convertLongString(
                    data.creatorName,
                    12 - data.likes.toString().length
                  )} */}
                </span>
              </Tooltip>
            </span>
          </span>
          <span className={`${style["float-right"]} ${style["serie-heart"]}`}>
            {favorite ? (
              <HeartFilled
                className={`${style["favorite-icon"]} ${style["color-red"]}`}
                onClick={onClickFavorite}
              />
            ) : (
              <HeartOutlined
                className={`${style["favorite-icon"]}`}
                onClick={onClickFavorite}
              />
            )}
          </span>
        </div>
      </div>
    </>
  );
};
