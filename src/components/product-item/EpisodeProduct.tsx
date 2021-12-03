import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { Tooltip } from "antd";
import { useRouter } from "next/router";
import { convertLongString } from "src/utils/common-function";
import { GetUserInfo } from "../../api/auth";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import EpisodeManagementAPI from "../../api/episode-management/episode-management";
import style from "./product-item.module.scss";

export const EpisodeProduct = ({ serieId, episode }) => {
  const { t } = useTranslation();

  const {
    name,
    price,
    thumbnail,
    totalLikes,
    alreadyLiked,
  } = episode;

  const router = useRouter();

  const [favorite, setFavorite] = useState(alreadyLiked);

  const userInfo = GetUserInfo();

  const [isLogged, setIsLogged] = useState(false);

  const [clientType, setClientType] = useState("");


  const onClickFavorite = () => {
    console.log(favorite);
    favorite ?
        EpisodeManagementAPI.unlike({
          userInfo: GetUserInfo(),
          episodeId: episode.episodeId,
        }).then((res) => {
          console.log(res);
          if (res.data == "success") {
            setFavorite(false);
          }
        }) : EpisodeManagementAPI.like({
          userInfo: GetUserInfo(),
          episodeId: episode.episodeId,
        }).then((res) => {
          console.log(res);
          if (res.data == "success") {
            setFavorite(true);
          }
        })
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (userInfo["encryptedPrivateKey"] && userInfo["publicKey"]) {
        setIsLogged(true);

        setClientType(userInfo.role["role"]);
      } else {
        setIsLogged(false);

        setClientType("");
      }
    }
  }, [userInfo]);

  return (
    <div className={`${style["episode-component"]}`}>
      <div
        onClick={() => {
          router.push(`/episode?serieId=${serieId}&episodeId=${episode.episodeId}`);
        }}
        className={`${style["cursor_pointer"]}`}>
        <img
          src={thumbnail}
          className={`${style["episode-image"]}`} />
        <Tooltip title={name}>
          <div className={`${style["episode-name"]}`}>
            {convertLongString(name, 22)}
          </div>
        </Tooltip>
      </div>

      <div className={`${style["cursor_pointer"]} ${style["bottom-detail"]}`}>
        <span className={`${style["episode-price"]}`}>
          {price ? price + ' $' : 'Free'}
        </span>
        <span className={`${style["float-right"]} ${style["episode-heart"]}`}>
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
  );
};
