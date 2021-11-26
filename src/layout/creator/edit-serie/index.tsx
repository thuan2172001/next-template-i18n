import React, { useState, useEffect } from "react";
import style from "../create_serie/create-serie.module.scss";
import { Button, Input } from "antd";
import { useTranslation } from "next-i18next";
import { SerieDetailInput } from "../create_serie/SerieDetailInput";
import { CatagorySelection } from "../create_serie/CategorySelection";
import { SerieThumbnail } from "../create_serie/SerieThumbnail";
import { SerieCover } from "../create_serie/SerieCover";
import CreatorCreateApi from "src/api/creator/series";
import { SaveAlertModal } from "../create_serie/save-alert-modal";
import { useRouter } from "next/router";
import { notifyError, notifySuccess } from "@components/toastify";
import { GetUserInfo } from "src/api/auth";

export const EditSerieTemplate = ({
  seriesId,
  leave,
  setLeave,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [firstInit, setFirstInit] = useState({
    cover: true,
    detailInput: true,
    thumb: true,
    cateSelect: false,
  });

  const [serieTitle, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [currentCover, setCurrentCover] = useState("");
  const [currentThumbnail, setCurrentThumbnail] = useState("");
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [cate, setCate] = useState(null);
  const [seriesInfo, setSeriesInfo] = useState(null);
  const [modalType, setModalType] = useState("");
  const [loading, setLoading] = useState(false);
  const [serieInputValid, setSerieInputValid] = useState(true);

  let isCoverEmpty = firstInit.cover
    ? false
    : coverPhoto === undefined || coverPhoto === null;

  let isThumbnailEmpty = firstInit.thumb
    ? false
    : thumbnail === undefined || thumbnail === null;


  const handleSave = () => {
    if (isCoverEmpty || !serieInputValid || isThumbnailEmpty || !cate)
      return;

    Upload().then(data => {
    }).catch(err => {
    })
  }

  useEffect(() => {
    if (!seriesId) return;
    CreatorCreateApi.getSeriesInfo({
      userInfo: GetUserInfo(),
      seriesId,
    })
      .then((data) => {
        console.log({ data })
        setCurrentCover(data.cover);
        setTitle(data?.serieName);
        setSummary(data?.description);
        setCurrentThumbnail(data?.thumbnail);
        setSeriesInfo(data);
        setCate(data?.category)
      })
      .catch(() => {
      });
  }, [seriesId]);

  useEffect(() => {
    window.onbeforeunload = () => {
      window.localStorage.removeItem("thumbnail");
      return "Dude, are you sure you want to leave? Think of the kittens!";
    };
    return () => {
      window.onbeforeunload = () => { };
    };
  }, []);

  useEffect(() => {
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
      history.go(1);
      setModalType("save-alert");
    };
    return () => {
      window.onpopstate = () => { };
    };
  }, []);

  const Upload = async () => {
    setLoading(true);
    const uploadSingleFile = (data): Promise<any> =>
      new Promise(async (resolve, reject) => {
        if (data) {
          const form = new FormData();
          form.append("file", data);
          CreatorCreateApi.uploadFile({
            formdata: form,
            userInfo: GetUserInfo(),
          })
            .then(({ key, location }) => {
              resolve({ key, location });
            })
            .catch(() => notifyError("Failed to upload files"));
        } else {
          resolve(null);
        }
      });

    const upload = await Promise.all([
      uploadSingleFile(coverPhoto),
      uploadSingleFile(thumbnail),
    ]);

    CreatorCreateApi.editSeries({
      userInfo: GetUserInfo(),
      seriesId: seriesId,
      cover: upload[0]?.location ?? currentCover,
      thumbnail: upload[1]?.location ?? currentThumbnail,
      serieName: serieTitle,
      description: summary,
      categoryId: cate?.id,
    }).then((res) => {
      if (!res.reason) {
        router.push(
          `/sm?view=${seriesInfo?.isPublishing ? "public" : "private"}&page=1`
        );
        notifySuccess(t("common:successMsg.editSuccess"))
      }
      else {
        notifyError("Failed to edit series");
      }
    }).catch(() => {
      notifyError("Failed to edit series");
    });
  };

  const TabLayout = () => {
    return (
      <div className={`${style["switch-tab"]}`}>
        <div
          className={`${style["switch-tab-item"]}  ${style["switch-tab-active"]}`}
        >
          {t("common:seriesManagement.dropDown.editSeries")}
        </div>
      </div>
    );
  };

  const FooterButton = () => {
    return (
      <div className={`${style["footer"]}`}>
        <Button
          className={`${style["button"]} ${style["cancel-button"]}`}
          onClick={() => setModalType("save-alert")}
        >
          {t("common:cancel")}
        </Button>
        <Button
          className={`${style["button"]} ${style["active-save"]} ${style["confirm-button"]}`}
          onClick={handleSave}
          loading={loading}
        >
          {t("account:accountPage.save")}
        </Button>
      </div>
    );
  };

  return (
    <div>
      <TabLayout />
      <div
        className={`${style["cover"]}`}
      >
        <SerieCover
          updateFile={({ cover }) => {
            if (cover === null)
              setFirstInit((firstInit) => ({
                ...firstInit,
                cover: false,
              }));
            setCoverPhoto(cover);
          }}
          isEmpty={false}
          type={"edit-cover"}
          currentCover={currentCover}
        />
      </div>
      <div className={`${style["body"]}`}>
        <SerieDetailInput
          setTitle={({ serieTitle }) => {
            setTitle(serieTitle);
          }}
          setSerieSummary={({ summary }) => {
            setSummary(summary);
          }}
          setInputsValid={({ valid }) => {
            setSerieInputValid(valid);
          }}
          firstInit={firstInit.detailInput}
          currentTitle={serieTitle}
          currentSummary={summary}
        />
        <div className={`${style["divider"]}`} />
        <SerieThumbnail
          updateFile={({ thumb }) => {
            if (thumb === null)
              setFirstInit((firstInit) => ({
                ...firstInit,
                thumb: false,
              }));
            setThumbnail(thumb);
          }}
          isEmpty={false}
          first={false}
          type={"edit-thumb"}
          currentThumb={currentThumbnail}
        />
        <CatagorySelection
          firstInit={firstInit.cateSelect}
          setCategory={setCate}
          category={cate}
        />
      </div>
      <div className={`${style["divider"]}`} />
      <FooterButton />
      {(modalType === "save-alert" || leave) && (
        <SaveAlertModal
          updateModalVisible={() => {
            setModalType("");
            setLeave();
          }}
          pathname={`/sm?view=${seriesInfo?.isPublishing ? "public" : "private"
            }&page=1`}
        />
      )}
    </div>
  );
};
