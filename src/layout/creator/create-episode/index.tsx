import React, {useEffect, useState} from "react";
import {PhotoUpload} from "@components/upload-photo";
import {FileUpload} from "@components/upload-photo/file-upload";
import {Form, Input, Radio, Space, Button} from "antd";
import Image from "next/image";
import {useTranslation} from "next-i18next";
import TextArea from "antd/lib/input/TextArea";
// import SeriesAPI from "../../../api/creator/series";
// import EpisodesAPI from "../../../api/creator/episode";
import {GetUserInfo} from "src/api/auth";
import {CancelCreateNftModal} from "./CancelCreateNftModal";
import {CustomCancelCreateNftModal} from "./CustomCancelCreateNftModal";
import {useRouter} from "next/router";
import {notifyError} from "@components/toastify";
import {PendingCreateNftModal} from "./PendingCreateNftModal";
import {NFTPreview} from "src/layout/creator/create-episode/preview";
import style from "./create-episode.module.scss";

const scrollToTop = () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
};

export const CreateEpisodeTemplate = ({leave, setLeave, setRoleValid}) => {
  const router = useRouter();
  const {serie} = router.query;
  const {t} = useTranslation();
  const [modalType, setModalType] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [preview, setPreview] = useState(false);
  const [serieData, setSerieData] = useState({});
  const [fileExt, setFileExt] = useState("xyz");
  const [cateInfo, setCateInfo] = useState();
  const [coverErrMsg, setCoverErrMsg] = useState("");
  const [submitClicked, setSubmitClicked] = useState(false);

  useEffect(() => {
    if (submitClicked) {
      validateAll();
    }
  }, [submitClicked]);

  const [isPending, setIsPending] = useState(false);

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
    console.log("Pr", preview);
  }, [preview]);

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
      window.localStorage.removeItem("video-url");
      window.localStorage.removeItem("music-url");
      window.localStorage.removeItem("thumbnail");
      window.localStorage.removeItem("music-thumbnail");
      window.localStorage.removeItem("media-thumbnail");
      window.localStorage.removeItem("video-thumbnail");

      return "Dude, are you sure you want to leave? Think of the kittens!";
    };
    return () => {
      window.onbeforeunload = () => {
      };
    };
  }, []);

  const [subCategories, setSubCategories] = useState(["Sub1", "Sub2", "Sub3"]);

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
    file: {
      file: null,
      isEmpty: true,
      errMsg: "",
    },
    isFree: false,
    seriesInfo: null,
  });

  // useEffect(() => {
  //   if (!serie) return;
  //
  //   SeriesAPI.getSeries({
  //     userInfo: GetUserInfo(),
  //     serieId: serie,
  //   })
  //     .then(({ info }) => {
  //       setSubCategories(info?.category?.map((category) => category?.name));
  //       setCateInfo(info?.parentCategory?.name);
  //       setUploadContent((uploadContent) => ({
  //         ...uploadContent,
  //         seriesInfo: {
  //           ...info,
  //           category: info?.parentCategory?.name,
  //         },
  //       }));
  //     })
  //     .catch(() => {
  //       setRoleValid("false");
  //     });
  // }, [serie]);

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

  const refreshPage = () => {
    window.location.reload();
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
      errMsg: isEmpty ? t("create_serie:inputEpThumbAlert") : "",
    }));
  };

  const validateFileEmpty = () => {
    const isEmpty =
      uploadContent.file.file === null || uploadContent.file.file === undefined;

    setUploadContent((uploadContent) => ({
      ...uploadContent,
      file: {
        ...uploadContent.file,
        isEmpty: isEmpty,
        errMsg: isEmpty ? t("create_serie:uploadFileAlert") : "",
      },
    }));
  };

  const validateFile = (size, name) => {
    const lastDot = name.lastIndexOf(".");
    const ext = name.substring(lastDot);
    const category = uploadContent.seriesInfo?.category;
    let extValid = uploadContent.seriesInfo?.formatAllowed.indexOf(ext) !== -1;
    let sizeValid =
      size <= (uploadContent.seriesInfo?.sizeAllowed || 100000000);
    let checkMsg = "";
    if (!extValid) {
      checkMsg = t(`create_serie:fileInvalidType${category}`);
    } else if (!sizeValid) {
      checkMsg = t(`create_serie:fileTooLarge${category}`);
    } else checkMsg = "";
    setUploadContent((uploadContent) => ({
      ...uploadContent,
      file: {
        ...uploadContent.file,
        errMsg: checkMsg,
      },
    }));
    return extValid && sizeValid;
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

  const [transferData, setTransferData] = useState({});

  useEffect(() => {
    let data = {
      thumnails: episodeThumbnail?.thumb?.pictureAsFile || "not",
      serie: serieData || "not",
      subCategory: subCategories,
      ...uploadContent,
    };
    setTransferData(data);
  }, [uploadContent, episodeThumbnail]);

  const Upload = async () => {
    setLoading(true);
    setVisible(true);
    const category = uploadContent.seriesInfo?.category;
    const uploadSingleFile = (data): Promise<any> =>
      new Promise((res, rej) => {
        const form = new FormData();
        if (!data) {
          rej("Errorrr");
        }
        form.append("file", data);
        // SeriesAPI.uploadFile({
        //   formdata: form,
        //   userInfo: GetUserInfo(),
        // })
        //   .then(({ key, location, pageNumber }) => {
        //     res({ key, location, pageNumber });
        //   })
        //   .catch(rej);
      });

    const upload = await Promise.all([
      uploadSingleFile(episodeThumbnail.thumb.pictureAsFile),
      uploadSingleFile(uploadContent.file.file.file),
    ]);

    const formdata = {
      title: uploadContent.title.content,
      isFree: uploadContent.type === "0" ? true : false,
      editions: uploadContent.numberOfEdition.num,
      key: upload[1].key,
      thumbnail: upload[0].location,
      pageNumber: upload[1].pageNumber,
      serieId: serie,
      description: uploadContent.description.content,
    };

    // EpisodesAPI.createEpisode({
    //   body: formdata,
    //   userInfo: GetUserInfo(),
    // })
    //   .then((res) => {
    //     setLoading(false);
    //     if (res.status === "pending") {
    //       setIsPending(true);
    //     } else setVisible(false);
    //   })
    //   .catch((err) => {
    //     setVisible(false);
    //     notifyError(err);
    //     setLoading(false);
    //   });
  };

  const validateAll = async () => {
    validateThumbEmpty();
    validateEpisodeTitle(uploadContent.title.content);
    validateNumberOfEdition(uploadContent.numberOfEdition.num);
    validateFileEmpty();

    if (
      !uploadContent.title.isEmpty &&
      uploadContent.title.isValid &&
      uploadContent.description.isValid &&
      !episodeThumbnail.isEmpty &&
      !uploadContent.file.isEmpty
    ) {
      setModalType("nft-confirm");
      submitClicked && setPreview(!preview);
    }
    setSubmitClicked(false);
  };

  return (
    <>
      {
        <div
          style={{
            minHeight: "70vh",
            opacity: preview ? 0 : 1,
            position: preview ? "absolute" : "static",
            top: preview ? "-100000px" : "0",
          }}
          className={`${style["biggest"]}`}
        >
          {isPending && <PendingCreateNftModal refreshPage={refreshPage}/>}

          <div
            style={{
              minHeight: "70vh",
            }}
            className={`${style["create-episode-content"]}`}
          >
            <div className={`${style["switch-tab"]}`}>
              <div className={`${style["switch-tab-item"]}`}>
                <span className={`${style["switch-tab-rank"]}`}>1</span>Create
                series
              </div>
              <div
                className={`${style["switch-tab-item"]} ${style["switch-tab-active"]}`}
              >
                <span className={`${style["switch-tab-rank"]} `}>2</span>
                Create episode
              </div>
            </div>
            <section className={`${style["select-episode-thumb"]}`}>
              <div className={`${style["serie-detail-header"]}`}>
                {t("create_serie:selectEpThumb")}
              </div>

              <div className={`${style["thumbnail-detail"]}`}>
                <PhotoUpload
                  className={"thumbnail-cover"}
                  setPagePicture={async ({pictureAsFile, pictureSrc}) => {
                    if (pictureAsFile === undefined) {
                      setEpisodeThumbnail({
                        isEmpty: true,
                        thumb: null,
                        ratioClassname: "",
                        sizeClassname: "",
                        widthClassname: "",
                        extClassname: "",
                        errMsg: t("create_serie:inputEpThumbAlert"),
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
                          thumb: {pictureAsFile},
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
                    className={`${style[episodeThumbnail.widthClassname]} ${
                      style["convention-item"]
                    }`}
                  >
                    {t("create_serie:convention1")}
                  </li>
                  <li
                    className={`${style[episodeThumbnail.ratioClassname]} ${
                      style["convention-item"]
                    }`}
                  >
                    {t("create_serie:convention2")}
                  </li>
                  <li
                    className={`${style[episodeThumbnail.sizeClassname]} ${
                      style["convention-item"]
                    }`}
                  >
                    {t("create_serie:convention3")}
                  </li>
                  <li
                    className={`${style[episodeThumbnail.extClassname]} ${
                      style["convention-item"]
                    }`}
                  >
                    {t("create_serie:convention4")}
                  </li>
                </ul>
              </div>
            </section>
            <section className={`${style["serie-info-ep"]}`}>
              <div className={`${style["serie-title"]}`}>
                <div>{t("create_serie:serieTit")}</div>
                <div className={`${style["title"]}`}>
                  {uploadContent.seriesInfo?.name || "Library of abc"}
                </div>
              </div>
              <div className={`${style["category-info"]}`}>
                <div>{t("create_serie:category")}</div>

                <Radio.Button
                  value={uploadContent.seriesInfo?.category}
                  style={{marginLeft: 0}}
                  className={`${style["serie-btn"]}`}
                  checked
                >
                  <div className={`${style["radio-value"]}`}>
                    {uploadContent.seriesInfo?.category || "Video"}
                    <div className={`${style["checked-icon"]}`}>
                      <Image src="/icons/checked.svg" width={19} height={19}/>
                    </div>
                  </div>
                </Radio.Button>
              </div>
              <div className={`${style["sub-category-info"]}`}>
                <div>{t("create_serie:subCategory")}</div>
                <div className={`${style["sub-category"]}`}>
                  {subCategories?.map((item, index) => {
                    if (index < subCategories.length - 1) {
                      let name = item;
                      if (index != 0) name = " " + name;
                      name += ",";
                      return <span key={index}>{name}</span>;
                    } else return <span key={index}>{" " + item}</span>;
                  })}
                </div>
              </div>
            </section>
            <Form layout="vertical">
              <Form.Item
                label={t("create_serie:epTilte")}
                style={{width: "48%"}}
              >
                <div
                  className={`${
                    uploadContent.title.isEmpty || !uploadContent.title.isValid
                      ? "error-border"
                      : ""
                  }`}
                >
                  <Input
                    placeholder={t("create_serie:max60Charac")}
                    value={uploadContent.title.content}
                    onChange={episodeTitleChange}
                  />
                </div>
                {uploadContent.title.isEmpty ? (
                  <div className={`${style["error-msg-input"]}`}>
                    {t("create_serie:inputEpTitleAlert")}
                  </div>
                ) : (
                  <>
                    {!uploadContent.title.isValid && (
                      <div className={`${style["error-msg-input"]}`}>
                        {t("create_serie:characterAlert1")}
                      </div>
                    )}
                  </>
                )}
              </Form.Item>
              <Form.Item
                style={{
                  width: "48%",
                }}
                label={t("create_serie:episodeDescription")}
              >
                <div
                  className={`${
                    !uploadContent.description.isValid ? "error-border" : ""
                  }`}
                >
                  <TextArea
                    placeholder={t("create_serie:episodeDescription")}
                    autoSize={{minRows: 4, maxRows: 5}}
                    name="summary"
                    value={uploadContent.description.content}
                    onChange={descriptionChange}
                  />
                </div>
                {!uploadContent.description.isValid && (
                  <div className={`${style["error-msg-input"]}`}>
                    {t("create_serie:characterAlert2")}
                  </div>
                )}
              </Form.Item>
            </Form>

            <section className={`${style["episode-type"]}`}>
              <div
                className={`${style["episode-option-header"]} ${style["episode-option"]}`}
              >
                {t("create_serie:epType")}
              </div>
              <Radio.Group
                value={uploadContent.type}
                onChange={episodeTypeChange}
              >
                <Space direction="vertical">
                  <Radio value="editions">
                    <div className={`${style["episode-option-type"]}`}>
                      {t("create_serie:limitedEdition")}
                    </div>
                    <div className={`${style["episode-option-detail"]}`}>
                      {t("create_serie:epOption1")}
                    </div>
                    <Form layout="vertical">
                      <Form.Item
                        label={t("create_serie:numOfEdition")}
                        style={{width: "44%"}}
                      >
                        <div
                          className={`${
                            !uploadContent.isFree &&
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
                                {t("create_serie:numberEditionEmpty")}
                              </div>
                            ) : (
                              <>
                                {!uploadContent.numberOfEdition.isValid && (
                                  <div
                                    className={`${style["error-msg-input"]}`}
                                  >
                                    {t("create_serie:positiveAlert")}
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
                      {t("create_serie:freeEdition")}
                    </div>
                    <div className={`${style["episode-option-detail"]}`}>
                      {t("create_serie:epOption2")}
                    </div>
                  </Radio>
                </Space>
              </Radio.Group>
            </section>

            <section className={`${style["upload-episode"]}`}>
              <div
                className={`${style["episode-option-header"]} ${style["episode-option"]}`}
              >
                {t("create_serie:uploadContent")}

              </div>

              <FileUpload
                validateAll={validateAll}
                className={`${style["file-upload"]}`}
                setFile={({file}) => {
                  if (file === undefined) {
                    setUploadContent((uploadContent) => ({
                      ...uploadContent,
                      file: {
                        file: null,
                        isEmpty: true,
                        errMsg: t("create_serie:uploadFileAlert"),
                      },
                    }));
                  } else {
                    let isValidated = validateFile(file.size, file.name);
                    if (isValidated) {
                      setUploadContent((uploadContent) => ({
                        ...uploadContent,
                        file: {
                          file: {file},
                          isEmpty: false,
                          errMsg: "",
                        },
                      }));
                    } else {
                      setUploadContent((uploadContent) => ({
                        ...uploadContent,
                        file: {
                          ...uploadContent.file,
                          file: null,
                        },
                      }));
                    }
                  }
                }}
                setCoverType={setFileExt}
                errorMsg={uploadContent.file.errMsg}
                seriesInfo={cateInfo}
                hasCover={null}
                setCoverErrMsg={(errMsg) => {
                  setCoverErrMsg(errMsg);
                }}
              />


            </section>
          </div>

          <div className={`${style["custom-serie-btn"]}`}>
            <Button
              className={`${style["button"]} ${style["cancel-button"]}`}
              onClick={() => {
                setModalType("cancel-nft");
              }}
            >
              {t("create_serie:cancel")}
            </Button>

            <Button
              className={`${style["button"]} ${style["active-save"]} ${style["confirm-button"]}`}
              onClick={() => {
                setSubmitClicked(true);
                if (episodeThumbnail.errMsg !== "") scrollToTop();
              }}
            >
              {t("create_serie:next")}
            </Button>
          </div>
        </div>
      }
      {modalType === "cancel-nft" && (
        <CancelCreateNftModal
          updateModalVisible={setModalType}
          serieID={serie}
        />
      )}
      {leave && <CustomCancelCreateNftModal updateModalVisible={setLeave}/>}

      {preview && (
        <NFTPreview
          data={transferData}
          setVisible={setPreview}
          upLoad={Upload}
          isLoading={isLoading}
          pending={isPending}
        />
      )}
    </>
  );
};
