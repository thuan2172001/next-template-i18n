import style from "./read.module.scss";
import {
  Space,
  Dropdown,
  Menu,
  Divider,
  Radio,
  Button,
  Slider,
  Tooltip,
} from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { useTranslation } from "next-i18next";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import EpisodeManagementAPI from "../../api/episode-management/episode-management";
import { formatTotalLike } from "src/utils/common-function";
import { convertLongString } from "src/utils/common-function";
import { RequireLoginModal } from "@components/modal/RequireLoginModal";
import { GetUserInfo } from "src/api/auth";

const initialState = {
  animation: "none",
  speed: "fast",
  area: 40,
};

function useComponentVisible(initialIsVisible) {
  const [isComponentVisible, setIsComponentVisible] =
    useState(initialIsVisible);
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  return { ref, isComponentVisible, setIsComponentVisible };
}

export const ReadHeader = ({
  setSettingData = null,
  setAreaIsChanging = null,
  setAreaDisappear = null,
  setShowHeader = null,
  showHeader,
  seriesData,
  preEps,
  currentEps,
  nextEps,
  settingData,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [favorite, setFavorite] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);

  const [setting, setSetting] = useState(settingData);

  useEffect(() => {
    setSettingData({ setting: setting });
  }, [setting]);

  const episodes = seriesData?.episodes;

  const firstEp = episodes?.[0]?.episodeId === currentEps?.episodeId;

  const lastEp =
    episodes?.[episodes.length - 1]?.episodeId === currentEps?.episodeId;

  useEffect(() => {
    if (!currentEps) return;
    console.log({ currentEps })
    setFavorite(currentEps.alreadyLiked);
    setTotalLikes(currentEps.likes);
  }, [currentEps]);

  const handleAnimationChange = (e) => {
    const { value } = e.target;
    setSetting({
      ...setting,
      animation: value,
    });
  };

  const handleSpeedChange = (e) => {
    const { value } = e.target;
    setSetting({
      ...setting,
      speed: value,
    });
  };

  const handleTapAreaChange = (value) => {
    setSetting({
      ...setting,
      area: value,
    });
    setAreaIsChanging({ isChange: true });
  };

  const restoreDefault = () => {
    setSetting(initialState);
  };

  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

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

  const [modalVisible, setModalVisible] = useState(false);

  const likeEpisode = () => {
    if (!isLogged) setModalVisible(true);
    else {
      EpisodeManagementAPI.toggleLikedSerie({
        userInfo: GetUserInfo(),
        episode: currentEps.episodeId,
      }).then((res) => {
        if (res.success) {
          setFavorite(res.isLiked);
          setTotalLikes(res.totalLikes);
        }
      });
    }
  };

  const backToSerie = () => {
    let callbackUrl = window.localStorage.getItem("closeEnjoyUrlCallback")
      ? window.localStorage.getItem("closeEnjoyUrlCallback")
      : seriesData
        ? `/serie/${seriesData?.serieId}`
        : "/";

    router.push(callbackUrl);
    window.localStorage.removeItem("closeEnjoyUrlCallback");
  };

  const LeftItem = () => {
    return (
      <Space size={seriesData ? 30 : 55}>
        <span
          className={`${style[seriesData ? "cursor-pointer" : ""]}`}
          onClick={seriesData && backToSerie}
        >
          {seriesData && <img src="/assets/icons/read-header/close.svg" />}
        </span>
        <span
          className={`${style[seriesData ? "cursor-pointer" : ""]}`}
          onClick={() => {
            seriesData && setIsComponentVisible(true);
          }}
        >
          {seriesData && <img src="/assets/icons/read-header/setting.svg" />}
        </span>
        <div style={{ width: 150 }} />
      </Space>
    );
  };

  const [gap, setGap] = useState(73);

  useEffect(() => {
    if (window.innerWidth > 1080) setGap(73);
    else setGap(30);
  }, [window.innerWidth]);

  const LockEp = ({ epName }) => {
    return (
      <div className={`${style["lock-episode"]}`}>
        <span className={`${style["lock"]}`}>
          <Tooltip title={epName}>{convertLongString(epName, 35)}</Tooltip>
        </span>
        <span className={`${style["buy-now"]}`}>{t("common:buyNow")}</span>
      </div>
    );
  };

  const PurchasedEp = ({ epName }) => {
    return (
      <span>
        {" "}
        <Tooltip title={epName}>{convertLongString(epName, 35)}</Tooltip>
      </span>
    );
  };

  const EpisodeMenu = seriesData ? (
    <Menu className={`${style["episode-menu"]}`}>
      {seriesData &&
        seriesData?.episodes?.map((episode, index) => {
          if (episode && episode.isLocked)
            return (
              <div key={episode?.episodeId}>
                <Menu.Item
                  onClick={() => {
                    seriesData &&
                      router.push({
                        pathname: "/read",
                        query: {
                          ...router.query,
                          episodeId: episode.episodeId,
                        },
                      });
                  }}
                >
                  <LockEp epName={episode.name} />
                </Menu.Item>
                {index < seriesData?.episodes.length - 1 && (
                  <Divider className={`${style["divider"]}`} />
                )}
              </div>
            );

          return (
            seriesData && (
              <div key={episode?.episodeId}>
                <Menu.Item
                  onClick={() => {
                    seriesData &&
                      router.push({
                        pathname: "/read",
                        query: {
                          ...router.query,
                          episodeId: episode.episodeId,
                        },
                      });
                  }}
                >
                  <PurchasedEp epName={episode.name} />
                </Menu.Item>
                {index < seriesData.episodes.length - 1 && (
                  <Divider className={`${style["divider"]}`} />
                )}
              </div>
            )
          );
        })}
    </Menu>
  ) : (
    <></>
  );

  const MiddleItem = () => {
    return (
      <Space size={gap}>
        <div
          className={`${style[seriesData ? "cursor" : ""]}`}
          onClick={() => {
            if (preEps) {
              seriesData &&
                router.push({
                  pathname: "/read",
                  query: { ...router.query, episodeId: preEps.episodeId },
                });
            }
          }}
        >
          {!firstEp && seriesData && <img src="/assets/icons/read-header/left.svg" />}
        </div>
        <Dropdown
          overlay={EpisodeMenu}
          trigger={["click"]}
          placement="bottomLeft"
        >
          <span
            className={`${style["episode-name"]} ${style[seriesData ? "cursor-pointer" : ""]
              }`}
          >
            {currentEps && (
              <Tooltip title={seriesData ? currentEps.name : ""}>
                {convertLongString(currentEps.name, gap)}
              </Tooltip>
            )}
          </span>
        </Dropdown>
        <div
          className={`${style["cursor"]}`}
          onClick={() => {
            if (nextEps) {
              seriesData &&
                router.push({
                  pathname: "/read",
                  query: { ...router.query, episodeId: nextEps.episodeId },
                });
            }
          }}
        >
          {!lastEp && seriesData && <img src="/assets/icons/read-header/right.svg" />}
        </div>
      </Space>
    );
  };

  const [windowHref, setWindowHref] = useState("");

  useEffect(() => {
    let href = window.location.href;
    setWindowHref(href.replace("&", "%26").replace("read", "nft"));
  }, []);

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${windowHref}`,
      "_blank"
    );
  };

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${windowHref}`,
      "_blank"
    );
  };

  const shareToLine = () => {
    window.open(
      `https://social-plugins.line.me/lineit/share?url=${windowHref}`,
      "_blank"
    );
  };

  const shareToPinterest = () => {
    window.open(
      `https://www.pinterest.com/pin-builder/?url=${windowHref}%3Futm_source%3Ddynamic%26utm_campaign%3Dbfsharepinterest&description=${currentEps.episodeId ? currentEps.episodeId : "Share"
      }&media=${seriesData.thumbnail}`,
      "_blank"
    );
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${windowHref.replace("%26", "&")}`);
  };

  const RightItem = () => {
    return (
      <Space size={16}>
        <div
          className={`${style[seriesData ? "cursor-pointer" : ""]}`}
          style={{ display: "flex" }}
        >
          {favorite ? (
            <HeartFilled
              className={`${style["favorite-icon"]}`}
              onClick={() => seriesData && likeEpisode()}
            />
          ) : (
            <HeartOutlined
              className={`${style["favorite-icon"]} ${style[!seriesData && "disable-cursor"]
                }`}
              onClick={() => seriesData && likeEpisode()}
            />
          )}
          <div className={`${style["like-number"]}`}>
            {formatTotalLike(totalLikes)}
          </div>
        </div>
        <span className={`${style[seriesData ? "cursor-pointer" : ""]}`}>
          <img src="/assets/icons/read-header/divider.svg" />
        </span>
        <span
          className={`${style[seriesData ? "cursor-pointer" : ""]}`}
          onClick={seriesData && shareToFacebook}
        >
          <img src="/assets/icons/read-header/facebook.svg" />
        </span>
        <span
          className={`${style[seriesData ? "cursor-pointer" : ""]}`}
          onClick={seriesData && shareToTwitter}
        >
          <img src="/assets/icons/read-header/twitter.svg" />
        </span>
        <span
          className={`${style[seriesData ? "cursor-pointer" : ""]}`}
          onClick={seriesData && shareToLine}
        >
          <img src="/assets/icons/read-header/line.svg" />
        </span>
        <span
          className={`${style[seriesData ? "cursor-pointer" : ""]}`}
          onClick={seriesData && shareToPinterest}
        >
          <img src="/assets/icons/read-header/pinterest.svg" />
        </span>
        <Tooltip title={seriesData ? "Link copied!" : ""} trigger="click">
          <span
            className={`${style[seriesData ? "cursor-pointer" : ""]}`}
            onClick={seriesData && copyToClipboard}
          >
            <img src="/assets/icons/read-header/copy.svg" />
          </span>
        </Tooltip>
      </Space>
    );
  };

  const [interact, setInteract] = useState(false);

  return (
    <div
      className={`${style["header"]} ${style["animated"]} ${showHeader ? style["fadeIn"] : style["fadeOut"]
        } ${interact && style["always-display"]}`}
      onMouseOver={() => {
        setInteract(true);
      }}
      onMouseLeave={() => {
        setInteract(false);
        setShowHeader({ showHeader: false });
      }}
    >
      <LeftItem />
      <MiddleItem />
      <RightItem />

      {/* setting */}
      {isComponentVisible && (
        <div className={`${style["setting-content"]}`} ref={ref}>
          <div className={`${style["setting-header"]} ${style["mt-12"]}`}>
            Page Animation
          </div>
          <Radio.Group
            value={setting.animation}
            buttonStyle="solid"
            onChange={handleAnimationChange}
            className={`${style["group-radio1"]}`}
          >
            <Radio.Button
              value="none"
              className={`${style["radio-btn"]} ${style["left-btn"]}`}
            >
              None
            </Radio.Button>
            <Radio.Button
              value="slide"
              className={`${style["radio-btn"]} ${style["right-btn"]}`}
            >
              Slide
            </Radio.Button>
          </Radio.Group>
          <div className={`${style["setting-header"]}`}>Animation Speed</div>
          <Radio.Group
            value={setting.speed}
            buttonStyle="solid"
            onChange={handleSpeedChange}
            className={`${style["group-radio"]}`}
          >
            <Radio.Button
              value="fast"
              className={`${style["radio-btn"]} ${style["left-btn"]}`}
            >
              Fast
            </Radio.Button>
            <Radio.Button
              value="normal"
              className={`${style["radio-btn"]} ${style["mid-btn"]}`}
            >
              Normal
            </Radio.Button>
            <Radio.Button
              value="slow"
              className={`${style["radio-btn"]} ${style["right-btn"]}`}
            >
              Slow
            </Radio.Button>
          </Radio.Group>
          <div className={`${style["setting-header"]}`}>Tap-To-Turn Area</div>
          <Slider
            value={setting.area}
            tooltipVisible={false}
            max={45}
            onChange={handleTapAreaChange}
            onAfterChange={() => setAreaDisappear({ isChange: false })}
            handleStyle={{
              width: "20px",
              height: "20px",
              background: "#fff",
              boxShadow: "1px 4px 9px rgba(30, 33, 45, 0.2)",
              border: "none",
              marginTop: "-8px",
            }}
            trackStyle={{
              height: "6px",
              background: "#5770FF",
            }}
          />

          <div className={`${style["btn-wrapper"]}`}>
            <Button
              onClick={seriesData && restoreDefault}
              className={`${style["reset-btn"]}`}
            >
              Restore Default
            </Button>
          </div>
        </div>
      )}

      {modalVisible && (
        <RequireLoginModal updateModalVisible={() => setModalVisible(false)} />
      )}
    </div>
  );
};
