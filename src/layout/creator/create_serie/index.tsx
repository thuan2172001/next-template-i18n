import React, { useState, useEffect } from "react";
import style from "./create-serie.module.scss";
import { Button } from "antd";
import { useTranslation } from "next-i18next";
import { SerieDetailInput } from "./SerieDetailInput";
import { CatagorySelection } from "./CategorySelection";
import { SerieThumbnail } from "./SerieThumbnail";
import { SerieCover } from "./SerieCover";
import CreatorCreateApi from "src/api/creator/series";
import { GetUserInfo } from "src/api/auth";
import { PreviewSerieTemplate } from "./preview/PreviewSerieTemplate";
import { SaveAlertModal } from "./save-alert-modal";
import { useRouter } from "next/router";
import category from "../../../api/category/category";

const scrollToTop = () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
};

export const CreateSerieTemplate = ({ leave, setLeave }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const TabLayout = () => {
    return (
      <div className={`${style["switch-tab"]}`}>
        <div
          className={`${style["switch-tab-item"]}  ${style["switch-tab-active"]}`}
        >
          <span className={`${style["switch-tab-rank"]}`}>1</span>Create series
        </div>
        <div className={`${style["switch-tab-item"]}`}>
          <span className={`${style["switch-tab-rank"]} `}>2</span>
          Create episode
        </div>
      </div>
    );
  };

  const [firstInit, setFirstInit] = useState(true);

  const [serieTitle, setTitle] = useState("");

  const [summary, setSummary] = useState("");

  const [serieInputValid, setSerieInputValid] = useState(false);

  const [preview, setPreview] = useState(false);

  const [coverPhoto, setCoverPhoto] = useState(null);
  let isCoverEmpty = coverPhoto === null || coverPhoto === undefined;

  const [thumbnail, setThumbnail] = useState(null);
  let isThumbnailEmpty = thumbnail === null || thumbnail === undefined;

  const [category, setCategory] = useState({
    name: "",
    id: ""
  })

  let cateInputValid = category.name !== "";

  const handlePreview = () => {
    setFirstInit(false);
    if (isCoverEmpty) {
      scrollToTop();
    }
    if (!serieInputValid) {
      scrollToTop();
    }

    if (!cateInputValid) console.log("cate is empty");

    if (isCoverEmpty || !serieInputValid || isThumbnailEmpty || !cateInputValid)
      return;

    setPreview(!preview);
  };

  useEffect(() => {
    window.onbeforeunload = () => {
      window.localStorage.removeItem("video-url");
      window.localStorage.removeItem("music-url");
      window.localStorage.removeItem("thumbnail");
      window.localStorage.removeItem("music-thumbnail");
      window.localStorage.removeItem("media-thumbnail");
      window.localStorage.removeItem("video-thumbnail");

      return "Dude, are you sure you want to leave? Think of the kittens!";
    };
    return () => {
      window.onbeforeunload = () => {};
    };
  }, []);
  useEffect(() => {
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
      history.go(1);
      setModalType("save-alert");
    };
    return () => {
      window.onpopstate = () => {};
    };
  }, []);

  const Upload = async () => {
    console.log("Uploading...");
    const uploadSingleFile = (data): Promise<any> =>
      new Promise(async (resolve, reject) => {
        const form = new FormData();
        form.append("file", data);
        CreatorCreateApi.uploadFile({
          formdata: form,
          userInfo: GetUserInfo(),
        })
          .then(({ key, location }) => {
            resolve({ key, location });
          })
          .catch(reject);
      });

    const upload = await Promise.all([
      uploadSingleFile(coverPhoto),
      uploadSingleFile(thumbnail),
    ]);

    const body = {
      cover: upload[0].location,
      thumbnail: upload[1].location,
      serieName: serieTitle,
      categoryId: category.id,
      description: summary,
    };

    CreatorCreateApi.createSeries({
      body: body,
      userInfo: GetUserInfo(),
    }).then((res) => {
      if (res.series) router.push(`/sm?view=private`);
      else console.log("create failed");
    });
  };

  const FooterButton = () => {
    return (
      <div className={`${style["footer"]}`}>
        <Button
          className={`${style["button"]} ${style["cancel-button"]}`}
          onClick={() => setModalType("save-alert")}
        >
          {t("create_serie:cancel")}
        </Button>
        <Button
          className={`${style["button"]} ${style["active-save"]} ${style["confirm-button"]}`}
          onClick={handlePreview}
        >
          {t("create_serie:preview")}
        </Button>
      </div>
    );
  };

  useEffect(() => {
    window.onbeforeunload = () => {
      return "Dude, are you sure you want to leave? Think of the kittens!";
    };
    return () => {
      window.onbeforeunload = () => {};
    };
  }, []);

  const [modalType, setModalType] = useState("");

  return (
    <div>
      {preview && (
        <PreviewSerieTemplate
          info={{
            title: serieTitle,
            summary: summary,
            category: [category.name],
          }}
          setPreview={setPreview}
          upload={Upload}
        />
      )}
      <div
        style={{
          minHeight: "100vh",
          opacity: preview ? 0 : 1,
          position: preview ? "absolute" : "relative",
          top: preview ? "-10000000px" : "0",
        }}
      >
        <TabLayout />
        <SerieCover
          updateFile={({ cover }) => {
            setCoverPhoto(cover);
          }}
          isEmpty={isCoverEmpty}
          first={firstInit}
        />
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
            firstInit={firstInit}
          />
          <div className={`${style["divider"]}`} />
          <SerieThumbnail
            updateFile={({ thumb }) => {
              console.log({ thumb });
              setThumbnail(thumb);
            }}
            isEmpty={isThumbnailEmpty}
            first={firstInit}
          />
          <CatagorySelection
            setCategory={(cate) => {
              setCategory(cate);
            }}
            firstInit={firstInit}
            category={category}
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
          />
        )}
      </div>
    </div>
  );
};
