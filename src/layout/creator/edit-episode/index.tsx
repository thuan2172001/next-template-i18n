import React, { useEffect, useState } from "react";
import { PhotoUpload } from "@components/upload-photo";
import { Form, Input, Radio, Space, Button } from "antd";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import TextArea from "antd/lib/input/TextArea";
import SeriesAPI from "../../../api/creator/series";
import EpisodesAPI from "../../../api/creator/episode";
import { GetUserInfo } from "src/api/auth";
import { useRouter } from "next/router";
import { notifyError, notifySuccess } from "@components/toastify";
import style from "../create-episode/create-episode.module.scss";
import Head from "next/head";
import { CustomCancelCreateNftModal } from "../create-episode/CustomCancelCreateNftModal";
import { CancelCreateNftModal } from "../create-episode/CancelCreateNftModal";

const scrollToTop = () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
};

export const EditEpisodeTemplate = ({ leave, setLeave }) => {
  const router = useRouter();
  const { serieId, episodeId } = router.query;
  const { t } = useTranslation();
  const [modalType, setModalType] = useState("");
  const [submitClicked, setSubmitClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [episodeThumbnail, setEpisodeThumbnail] = useState({
    thumb: null,
    isEmpty: true,
    sizeClassname: "",
    ratioClassname: "",
    widthClassname: "",
    extClassname: "",
    errMsg: "",
  });

  useEffect(() => {
    if (submitClicked) {
      validateAll();
    }
  }, [submitClicked]);

  useEffect(() => {
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
      history.go(1);
      setModalType("cancel-nft");
    };
    return () => {
      window.onpopstate = () => {
      };
    };
  }, []);

  useEffect(() => {
    window.onbeforeunload = () => {
      window.localStorage.removeItem("thumbnail");
      return "Dude, are you sure you want to leave? Think of the kittens!";
    };
    return () => {
      window.onbeforeunload = () => {
      };
    };
  }, []);

  const [uploadContent, setUploadContent] = useState({
    title: {
      content: "",
      isEmpty: false,
      isValid: true,
    },
    description: {
      content: "",
      isValid: true,
    },
    type: "editions",
    numberOfEdition: {
      num: "",
      isEmpty: true,
      isValid: false,
    },
    chapter: {
      content: "",
      isEmpty: false
    },
    isFree: false,
    seriesInfo: null,
    category: null
  });

  useEffect(() => {
    if (!serieId || !episodeId) return;
    EpisodesAPI.getEpisodeInfo({ userInfo: GetUserInfo(), episodeId: episodeId }).then((data) => {
      router.isReady && setUploadContent({
        ...uploadContent,
        chapter: { content: data?.data?.chapter || "", isEmpty: false },
        description: { content: data?.data?.description || "", isValid: true },
        title: { content: data?.data?.name || "", isEmpty: false, isValid: true },
        type: data?.data?.price > 0 ? "editions" : "free",
        numberOfEdition: { num: data?.data?.price?.toString(), isEmpty: false, isValid: true },
        seriesInfo: data?.data?.serie,
        category: data?.data?.category
      })
      router.isReady && setEpisodeThumbnail({
        ...episodeThumbnail,
        thumb: data?.data?.thumbnail,
        isEmpty: false
      })
    })
  }, [router.isReady]);

  const handleChapterInput = (value) => {
    const isEmpty = value === ""
    setUploadContent((uploadContent) => ({
      ...uploadContent,
      chapter: {
        content: value,
        isEmpty: isEmpty
      }
    }))
  }

  const episodeTitleChange = (e) => {
    const isValid = e.target.value.replace(/ +(?= )/g, "").length <= 60; //remove multiple whitespaces
    const isEmpty = e.target.value.replace(/\s/g, "") === ""; //remove all whitespaces
    if (isValid) {
      setUploadContent((uploadContent) => ({
        ...uploadContent,
        title: {
          ...uploadContent.title,
          content: e.target.value,
          isEmpty: isEmpty,
          isValid: isValid,
        },
      }));
    } else {
      setUploadContent((uploadContent) => ({
        ...uploadContent,
        title: {
          ...uploadContent.title,
          content: e.target.value.slice(0, 60),
          isEmpty: isEmpty,
          isValid: isValid,
        },
      }));
    }
  };

  const episodeTypeChange = (e) => {
    setUploadContent((uploadContent) => ({
      ...uploadContent,
      isFree: e.target.value !== "editions",
      type: e.target.value,
    }));
  };

  const descriptionChange = (e) => {
    const isValid = e.target.value.length <= 500 && e.target.value.length >= 0;
    if (isValid) {
      setUploadContent((uploadContent) => ({
        ...uploadContent,
        description: {
          ...uploadContent.description,
          isValid: isValid,
          content: e.target.value,
        },
      }));
    } else {
      setUploadContent((uploadContent) => ({
        ...uploadContent,
        description: {
          ...uploadContent.description,
          isValid: isValid,
          content: e.target.value.slice(0, 500),
        },
      }));
    }
  };

  const numberEditionChange = (e) => {
    e.target.value = e.target.value.replace(/\D/g, "");
    validateNumberOfEdition(e.target.value);
    setUploadContent((uploadContent) => ({
      ...uploadContent,
      numberOfEdition: {
        ...uploadContent.numberOfEdition,
        num: e.target.value,
      },
    }));
  };

  const validateEpisodeTitle = (value) => {
    value = value.replace(/ +(?= )/g, "");
    setUploadContent((uploadContent) => ({
      ...uploadContent,
      title: {
        ...uploadContent.title,
        content: value,
        isEmpty: value === "",
        isValid: value !== "" && value.length < 60,
      },
    }));
  };

  const validateImage = (type, size, src, name) =>
    new Promise((resolve, reject) => {
      let lastDot = name.lastIndexOf(".");
      let ext = name.substring(lastDot + 1);
      !validateImageExt(type, ext) && resolve(false);

      if (type === "thumb") {
        let width, height;
        let img = document.createElement("img");
        img.src = src;
        img.onload = () => {
          width = img.naturalWidth || img.width;
          height = img.naturalHeight || img.height;
          validateThumbPicture(width, height, size);
          if (
            episodeThumbnail.extClassname !== "convention-valid" ||
            episodeThumbnail.ratioClassname !== "convention-valid" ||
            episodeThumbnail.sizeClassname !== "convention-valid" ||
            episodeThumbnail.widthClassname !== "convention-valid"
          ) {
            setEpisodeThumbnail((episodeThumbnail) => ({
              ...episodeThumbnail,
              thumb: null,
              isEmpty: true,
            }));
          }
          resolve(true);
        };
      }

    });

  const validateImageExt = (type, ext) => {
    const isValid = ext === "png" || ext === "jpg" || ext === "jpeg";

    type === "thumb" &&
      setEpisodeThumbnail((episodeThumbnail) => ({
        ...episodeThumbnail,
        extClassname: isValid ? "convention-valid" : "convention-invalid",
      }));
    return isValid;
  };

  const validateThumbPicture = (width, height, size) => {
    setEpisodeThumbnail((episodeThumbnail) => ({
      ...episodeThumbnail,
      sizeClassname:
        size <= 10000000 ? "convention-valid" : "convention-invalid",
      ratioClassname:
        width === height ? "convention-valid" : "convention-invalid",
      widthClassname:
        width >= 500 && height >= 500
          ? "convention-valid"
          : "convention-invalid",
    }));
  };

  const validateThumbEmpty = () => {
    const isEmpty =
      episodeThumbnail.thumb === null ||
      episodeThumbnail.thumb.pictureAsFile === undefined;

    setEpisodeThumbnail((episodeThumbnail) => ({
      ...episodeThumbnail,
      isEmpty: isEmpty,
      errMsg: isEmpty ? t("create-series:inputEpThumbAlert") : "",
    }));
  };

  const isPositiveInteger = (str) => {
    return str > 0;
  };

  const validateNumberOfEdition = (value) => {
    setUploadContent((uploadContent) => ({
      ...uploadContent,
      numberOfEdition: {
        ...uploadContent.numberOfEdition,
        isEmpty: value === "",
        isValid: isPositiveInteger(value),
      },
    }));
  };

  const Upload = async () => {
    setLoading(true);
    const uploadSingleFile = (data): Promise<any> =>
      new Promise(async (resolve, reject) => {
        const form = new FormData();
        form.append("file", data);
        SeriesAPI.uploadFile({
          formdata: form,
          userInfo: GetUserInfo(),
        })
          .then(({ key, location }) => {
            resolve({ key, location });
          })
          .catch(reject);
      });

    const upload = episodeThumbnail.thumb.pictureAsFile ? await Promise.all([
      uploadSingleFile(episodeThumbnail.thumb.pictureAsFile).catch(err => {
        setLoading(false);
        notifyError(t("common:errorMsg.uploadFileFailed"))
      }),
    ]) : null;

    const formdata = {
      chapter: uploadContent.chapter.content,
      name: uploadContent.title.content,
      price: parseInt(uploadContent.numberOfEdition.num, 10) ?? 0,
      thumbnail: upload ? upload[0].location : episodeThumbnail.thumb,
      description: uploadContent.description.content,
    };

    EpisodesAPI.editEpisode({
      body: formdata,
      userInfo: GetUserInfo(),
      episodeId: episodeId,
    })
      .then((res) => {
        notifySuccess(t("common:successMsg.editSuccess"));
        router.push(`/episode?serieId=${serieId}&episodeId=${episodeId}`)
      })
      .catch((err) => {
        notifyError(err);
        setLoading(false);
      });
  };

  const validateAll = async () => {
    validateThumbEmpty();
    validateEpisodeTitle(uploadContent.title.content);
    validateNumberOfEdition(uploadContent.numberOfEdition.num);

    if (
      !uploadContent.title.isEmpty &&
      !uploadContent.chapter.isEmpty &&
      uploadContent.title.isValid &&
      uploadContent.description.isValid &&
      !episodeThumbnail.isEmpty
    ) {
      setModalType("nft-confirm");
      if (submitClicked) {
        Upload().then(data => {
          console.log(data)
        }).catch(console.log)
      }
    }
    setSubmitClicked(false);
  };

  return (
    <>
      <Head>
        <title>WebtoonZ | {t("common:episodeManagement:editEpisode")}</title>
      </Head>
      {
        <div
          style={{
            minHeight: "70vh",
            opacity: 1,
            position: "static",
            top: "0",
          }}
          className={`${style["biggest"]}`}
        >
          <div
            style={{
              minHeight: "70vh",
            }}
            className={`${style["create-episode-content"]}`}
          >
            <div className={`${style["switch-tab"]}`}>
              <div className={`${style["switch-tab-item"]}`}>
                <span className={`${style["switch-tab-rank"]}`}>1</span>
                {t("common:episodeManagement.editEpisode")}
              </div>
            </div>
            <section className={`${style["select-episode-thumb"]}`}>
              <div className={`${style["serie-detail-header"]}`}>
                {t("create-series:selectEpThumb")}
              </div>

              <div className={`${style["thumbnail-detail"]}`}>
                <PhotoUpload
                  className={"thumbnail-cover"}
                  startImage={episodeThumbnail.thumb}
                  setPagePicture={async ({ pictureAsFile, pictureSrc }) => {
                    if (pictureAsFile === undefined) {
                      setEpisodeThumbnail({
                        isEmpty: true,
                        thumb: null,
                        ratioClassname: "",
                        sizeClassname: "",
                        widthClassname: "",
                        extClassname: "",
                        errMsg: t("create-series:inputEpThumbAlert"),
                      });
                    } else {
                      let isValidated = await validateImage(
                        "thumb",
                        pictureAsFile.size,
                        pictureSrc,
                        pictureAsFile.name
                      );

                      if (isValidated) {
                        setEpisodeThumbnail((episodeThumbnail) => ({
                          ...episodeThumbnail,
                          thumb: { pictureAsFile },
                          errMsg: "",
                          isEmpty: false,
                        }));
                      } else
                        setEpisodeThumbnail((episodeThumbnail) => ({
                          ...episodeThumbnail,
                          thumb: null,
                        }));
                    }
                  }}
                  type="thumb"
                  errorMsg={episodeThumbnail.errMsg}
                  setChanged={() => console.log("changed")}
                />

                <ul className={`${style["thumbnail-cover-convention"]}`}>
                  <li
                    className={`${style[episodeThumbnail.widthClassname]} ${style["convention-item"]
                      }`}
                  >
                    {t("create-series:convention1")}
                  </li>
                  <li
                    className={`${style[episodeThumbnail.ratioClassname]} ${style["convention-item"]
                      }`}
                  >
                    {t("create-series:convention2")}
                  </li>
                  <li
                    className={`${style[episodeThumbnail.sizeClassname]} ${style["convention-item"]
                      }`}
                  >
                    {t("create-series:convention3")}
                  </li>
                  <li
                    className={`${style[episodeThumbnail.extClassname]} ${style["convention-item"]
                      }`}
                  >
                    {t("create-series:convention4")}
                  </li>
                </ul>
              </div>
            </section>
            <section className={`${style["serie-info-ep"]}`}>
              <div className={`${style["serie-title"]}`}>
                <div>{t("create-series:series")}</div>
                <div className={`${style["title"]}`}>
                  {uploadContent.seriesInfo?.serieName || "Library of abc"}
                </div>
              </div>
              <div className={`${style["category-info"]}`}>
                <div>{t("create-series:category")}</div>
                <Radio.Button
                  value={uploadContent.category?.categoryName}
                  style={{ marginLeft: 0 }}
                  className={`${style["serie-btn"]}`}
                  checked
                >
                  <div className={`${style["radio-value"]}`}>
                    {uploadContent.category?.categoryName || "Comedy"}
                    <div className={`${style["checked-icon"]}`}>
                      <Image src="/assets/icons/checked.svg" width={19} height={19} />
                    </div>
                  </div>
                </Radio.Button>
              </div>
            </section>
            <Form layout="vertical">
              <Form.Item
                label={t("create-series:epTitle")}
                style={{ width: "48%" }}
              >
                <div
                  className={`${uploadContent.title.isEmpty || !uploadContent.title.isValid
                    ? "error-border"
                    : ""
                    }`}
                >
                  <Input
                    placeholder={t("create-series:max60Characters")}
                    value={uploadContent.title.content}
                    onChange={episodeTitleChange}
                  />
                </div>
                {uploadContent.title.isEmpty ? (
                  <div className={`${style["error-msg-input"]}`}>
                    {t("create-series:inputEpTitleAlert")}
                  </div>
                ) : (
                  <>
                    {!uploadContent.title.isValid && (
                      <div className={`${style["error-msg-input"]}`}>
                        {t("create-series:max60Characters")}
                      </div>
                    )}
                  </>
                )}
              </Form.Item>
              <Form.Item
                label={"Chapter"}
                style={{ width: "48%" }}
              >
                <div
                  className={`${uploadContent.chapter.isEmpty
                    ? "error-border"
                    : ""
                    }`}
                >
                  <Input
                    placeholder={t("create-series:max60Character")}
                    value={uploadContent.chapter.content}
                    onChange={(e) => handleChapterInput(e.target.value)}
                  />
                </div>
                {uploadContent.chapter.isEmpty && (
                  <div className={`${style["error-msg-input"]}`}>
                    {t("create-series:inputChapter")}
                  </div>
                )}
              </Form.Item>
              <Form.Item
                style={{
                  width: "48%",
                }}
                label={t("create-series:summary")}
              >
                <div
                  className={`${!uploadContent.description.isValid ? "error-border" : ""
                    }`}
                >
                  <TextArea
                    placeholder={t("create-series:summary")}
                    autoSize={{ minRows: 4, maxRows: 5 }}
                    name="summary"
                    value={uploadContent.description.content}
                    onChange={descriptionChange}
                  />
                </div>
                {!uploadContent.description.isValid && (
                  <div className={`${style["error-msg-input"]}`}>
                    {t("create-series:max500Characters")}
                  </div>
                )}
              </Form.Item>
            </Form>

            <section className={`${style["episode-type"]}`}>
              <div
                className={`${style["episode-option-header"]} ${style["episode-option"]}`}
              >
                {t("create-series:category")}
              </div>
              <Radio.Group
                value={uploadContent.type}
                onChange={episodeTypeChange}
              >
                <Space direction="vertical">
                  <Radio value="editions">
                    <div className={`${style["episode-option-type"]}`}>
                      {t("create-series:limitedEdition")}
                    </div>
                    <Form layout="vertical">
                      <Form.Item
                        label={t("create-series:price")}
                        style={{ width: "100%" }}
                      >
                        <div
                          className={`${!uploadContent.isFree &&
                            (uploadContent.numberOfEdition.isEmpty ||
                              !uploadContent.numberOfEdition.isValid)
                            ? "error-border"
                            : ""
                            }`}
                        >
                          <Input
                            placeholder="1"
                            value={uploadContent.numberOfEdition.num}
                            onChange={numberEditionChange}
                            disabled={uploadContent.isFree}
                          />
                        </div>
                        {!uploadContent.isFree && (
                          <>
                            {uploadContent.numberOfEdition.isEmpty ? (
                              <div className={`${style["error-msg-input"]}`}>
                                {t("create-series:inputPrice")}
                              </div>
                            ) : (
                              <>
                                {!uploadContent.numberOfEdition.isValid && (
                                  <div
                                    className={`${style["error-msg-input"]}`}
                                  >
                                    {t("create-series:positiveAlert")}
                                  </div>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </Form.Item>
                    </Form>
                  </Radio>
                  <Radio value="0">
                    <div className={`${style["episode-option-type"]}`}>
                      {t("create-series:freeEdition")}
                    </div>
                    <div className={`${style["episode-option-detail"]}`}>
                      {t("create-series:epOption2")}
                    </div>
                  </Radio>
                </Space>
              </Radio.Group>
            </section>
          </div>

          <div className={`${style["custom-serie-btn"]}`}>
            <Button
              className={`${style["button"]} ${style["cancel-button"]}`}
              onClick={() => {
                setModalType("cancel-nft");
              }}
            >
              {t("create-series:cancel")}
            </Button>

            <Button
              className={`${style["button"]} ${style["active-save"]} ${style["confirm-button"]}`}
              onClick={() => {
                setSubmitClicked(true);
                if (episodeThumbnail.errMsg !== "") scrollToTop();
              }}
              loading={loading}
            >
              {t("account:accountPage.save")}
            </Button>
          </div>
        </div>
      }
      {modalType === "cancel-nft" && (
        <CancelCreateNftModal
          updateModalVisible={setModalType}
          serieID={serieId}
        />
      )}
      {leave && <CustomCancelCreateNftModal updateModalVisible={setLeave} />}
    </>
  );
};
