import React, { useState, useEffect } from "react";
import { ReadHeader } from "./header";
import { Read } from "./read";
import ReadAPI from "../../api/read/read";
import { useRouter } from "next/router";
import CustomerProfileAPI from "../../api/customer/profile";
import { GetUserInfo } from "src/api/auth";
import Head from "next/head";

const initialState = {
  animation: "none",
  speed: "fast",
  area: 35,
};

export const ReadTemplate = () => {
  const router = useRouter();

  const [serieId, setSerieId] = useState(router.query["serieId"]);
  const [episodeId, setEpisodeId] = useState(router.query["episodeId"]);
  const [currentEps, setCurrentEps] = useState(null);
  const [nextEps, setNextEps] = useState(null);
  const [preEps, setPreEps] = useState(null);

  const [setting, setSetting] = useState(null);
  const [isAreaChange, setIsChangeArea] = useState(false);
  const [seriesData, setSeriesData] = useState(null);

  useEffect(() => {
    router.isReady &&
      router.query.serieId != serieId &&
      setSerieId(router.query.serieId);
    router.isReady &&
      router.query.episodeId != episodeId &&
      setEpisodeId(router.query.episodeId);
  }, [router]),

    useEffect(() => {
      ReadAPI.getSerie({
        userInfo: GetUserInfo(),
        serieId,
      })
        .then((res) => {
          if (!res.error) {
            setSeriesData(res);
            res.episodes.forEach((data, index) => {
              if (data.episodeId == episodeId) {
                if (index > 0) setPreEps(res.episodes[index - 1]);
                const dt = {...data, isLocked: GetUserInfo().role === "creator" ? false : data.isLocked}
                if (GetUserInfo().role === "creator") setCurrentEps(dt)
                if (index < res.episodes.length - 1)
                  setNextEps(res.episodes[index + 1]);
              }
            });
          }
        })
        .catch();
      getSettingRead();
    }, []);

  useEffect(() => {
    if (!seriesData) return;
    seriesData.episodes.forEach((data, index) => {
      if (data.episodeId == episodeId) {
        if (index > 0) setPreEps(seriesData.episodes[index - 1]);
        const dt = {...data, isLocked: GetUserInfo().role === "creator" ? false : data.isLocked}
        setCurrentEps(dt);
        if (index < seriesData.episodes.length - 1)
          setNextEps(seriesData.episodes[index + 1]);
      }
    });
  }, [episodeId]);

  useEffect(() => {
    if (setting) {
      CustomerProfileAPI.updateSettingRead({
        userInfo: GetUserInfo(),
        settingRead: JSON.stringify(setting)
      }).catch();
    }
  }, [setting])

  const getSettingRead = () => {
    CustomerProfileAPI.getSettingRead({ userInfo: GetUserInfo() }).then(res => {
      if (res.animation && res.speed && res.area >= 0) {
        setSetting(res);
      } else {
        setSetting(initialState)
      }
    }).catch(() => {
      setSetting(initialState)
    })
  }

  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    if (showHeader) {
      setTimeout(() => {
        setShowHeader(false);
      }, 5000);
    }
  }, [showHeader]);

  if (!setting) return <div></div>
  return (
    <>
      <Head>
        <title>WebtoonZ</title>
      </Head>
      <ReadHeader
        setSettingData={({ setting }) => {
          setSetting(setting);
        }}
        setAreaIsChanging={({ isChange }) => setIsChangeArea(isChange)}
        setAreaDisappear={({ isChange }) => setIsChangeArea(isChange)}
        setShowHeader={({ showHeader }) => setShowHeader(showHeader)}
        seriesData={seriesData}
        preEps={preEps}
        currentEps={currentEps}
        nextEps={nextEps}
        showHeader={showHeader}
        settingData={setting}
      />
      <Read
        setting={setting}
        isAreaChange={isAreaChange}
        serieId={serieId}
        episodeId={episodeId}
        currentEps={currentEps}
        setShowHeader={() => setShowHeader(!showHeader)}
      />
    </>
  );
};
