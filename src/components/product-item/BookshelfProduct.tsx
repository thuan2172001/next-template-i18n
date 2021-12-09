import React, { useEffect, useState } from "react";
import { Tooltip } from "antd";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import style from "./bookshelf-product.module.scss";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { convertLongString } from "src/utils/common-function";
import { RequireLoginModal } from "@components/modal/RequireLoginModal";
import EpisodeManagementAPI from "../../api/episode-management/episode-management";
import { GetUserInfo } from "src/api/auth";

export const BookshelfProduct = ({
  episode,
  classNames = "",
  displayAuthor = false,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userInfo = GetUserInfo();

      if (userInfo["encryptedPrivateKey"] && userInfo["publicKey"]) {
        setIsLogged(true);
      } else {
        setIsLogged(false);
      }
    }
  }, []);

  const { alreadyLiked } = episode;

  const [data, setData] = useState({
    creatorName: "Trinh Van Thuan",
    creatorAvatar: episode.author?.avatar,
    likes: episode.totalLikes,
    episodeName: episode.name,
    thumbanailSrc: episode.thumbnail,
    isFree: episode.isFree,
    favorite: episode.alreadyLiked,
  });

  const [favorite, setFavorite] = useState(alreadyLiked);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const initialData = {
      creatorName: "Trinh Van Thuan",
      creatorAvatar: episode.author?.avatar || '/assets/demo/demo-avatar.svg',
      likes: episode.totalLikes,
      episodeName: episode.name,
      thumbanailSrc: episode.thumbnail,
      isFree: episode.price === 0,
      favorite: episode.alreadyLiked,
    };
    setData(initialData);
  }, [episode]);

  const onClickFavorite = () => {
    if (!isLogged) setModalVisible(true);
    else {
      favorite ?
        EpisodeManagementAPI.unlike({
          userInfo: GetUserInfo(),
          episodeId: episode.episodeId,
        }).then((res) => {
          
          if (res.data == "success") {
            setFavorite(false);
          }
        }) : EpisodeManagementAPI.like({
          userInfo: GetUserInfo(),
          episodeId: episode.episodeId,
        }).then((res) => {
          
          if (res.data == "success") {
            setFavorite(true);
          }
        })

    }
  };

  const formatTotalLike = (likes) => {
    if (!likes) return 0;
    if (likes >= 1000000) return Math.floor(likes / 1000000) + "M";
    if (likes >= 1000) return Math.floor(likes / 1000) + "K";
    return likes;
  };

  const handelMoveToNft = () => {
    window.localStorage.setItem('closeEnjoyUrlCallback', router.pathname);
    router.push(`/episode?serieId=${episode.serieId}&episodeId=${episode.episodeId}`);
  };

  if (!displayAuthor)
    return (
      <>
        <div className={`${style["serie-component"]} ${style[classNames]}`}>
          <div className={`${style["cursor_pointer"]}`}>
            <img
              src={data.thumbanailSrc}
              className={`${style["serie-image"]}`}
              onClick={handelMoveToNft}
            />
            <div
              className={`${style["cursor_pointer"]} ${style["bottom-detail"]}`}
            >
              <Tooltip title={data.episodeName}>
                <div
                  className={`${style["serie-name"]}`}
                  onClick={handelMoveToNft}
                >
                  {convertLongString(data.episodeName, 22)}
                </div>
              </Tooltip>
              <div className={`${style["creator-info"]}`}>
                <span
                  className={`${style["serie-detail"]}`}
                >
                  {data.creatorAvatar && (
                    <img
                      src={data.creatorAvatar}
                      className={`${style["avatar-creator"]}`}
                    />
                  )}
                  <span
                    className={`${style["serie-creator-name"]} ${style["cursor_pointer"]}`}
                  >
                    <Tooltip title={data.creatorName}>
                      <span
                        className={`${style["text-color-black"]} ${style["creator-name"]}`}
                      >
                        {convertLongString(data.creatorName, 16)}
                      </span>
                    </Tooltip>
                  </span>
                </span>
              </div>

              <div className={`${style["last-row"]}`}>
                {!data.isFree ? (
                  <span className={`${style["edition-count"]}`}>
                    {`${episode?.price}$`}
                  </span>
                ) : (
                  <span className={`${style["edition-free"]}`}>
                    {t("common:free")}
                  </span>
                )}
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

                  <span className={`${style["serie-creator-name"]}`}>
                    {formatTotalLike(data.likes)}
                  </span>
                </span>
              </div>
            </div>
          </div>
          {modalVisible && (
            <RequireLoginModal
              updateModalVisible={() => setModalVisible(false)}
            />
          )}
        </div>
      </>
    );

  return (
    <>
      <div className={`${style["episode-component"]} ${style[classNames]}`}>
        <div onClick={handelMoveToNft} className={`${style["cursor_pointer"]}`}>
          <img src={data.thumbanailSrc} className={`${style["serie-image"]}`} />
          <Tooltip title={data.episodeName}>
            <div className={`${style["serie-name"]}`}>
              {convertLongString(data.episodeName, 24)}
            </div>
          </Tooltip>
        </div>

        <div className={`${style["cursor_pointer"]} ${style["bottom-detail"]}`}>
          <span
            className={`${style["serie-detail"]}`}
          >
            {data.creatorAvatar ? (
              <img
                src={data.creatorAvatar}
                className={`${style["avatar-creator"]}`}
              />
            ) : (
              <img src={data.creatorAvatar} />
            )}
            <span
              className={`${style["serie-creator-name"]} ${style["cursor_pointer"]}`}
            >
              <Tooltip title={data.creatorName}>
                <span
                  className={`${style["text-color-black"]} ${style["creator-name"]}`}
                >
                  {convertLongString(
                    data.creatorName,
                    16 - data.likes.toString().length
                  )}
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

            <span className={`${style["serie-creator-name"]}`}>
              {formatTotalLike(data.likes)}
            </span>
          </span>
        </div>
        {modalVisible && (
          <RequireLoginModal
            updateModalVisible={() => setModalVisible(false)}
          />
        )}
      </div>
    </>
  );
};
