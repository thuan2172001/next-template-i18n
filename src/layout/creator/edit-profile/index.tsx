import React, { useEffect, useState } from "react";
import { PhotoUpload } from "@components/upload-photo";
import { Form, Input, Radio, Space, Button, Row, Col } from "antd";
import { useTranslation } from "next-i18next";
import TextArea from "antd/lib/input/TextArea";
import CreatorInfo from "../../../api/creator/profile"
import { GetUserInfo } from "src/api/auth";
import { CustomCancelCreateNftModal } from "../../../layout/creator/create-episode/CustomCancelCreateNftModal";
import style from "./edit-profile.module.scss";
import Head from "next/head";
import { notifyError, notifySuccess } from "@components/toastify";
//todo
const scrollToTop = () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
};

const defaultData = {
  title: {
    content: "",
    isEmpty: false,
    isValid: true,
  },
  description: {
    content: "",
    isValid: true,
    isEmpty: false,
  },
  snsurl: [
    {
      type: "twitter",
      url: "",
      isUsed: false,
    },
  ],
  addurl: {
    url1: "",
    url2: "",
    url3: "",
    url4: "",
    url5: "",
  },
};

export const EditProfileTemplate = ({ leave, setLeave }) => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [changed, setChanged] = useState(false);

  const [episodeThumbnail, setShopAvatar] = useState({
    thumb: null,
    isEmpty: true,
    sizeClassname: "",
    ratioClassname: "",
    widthClassname: "",
    extClassname: "",
    errMsg: "",
  });
  const [currentAvatar, setCurrentAvatar] = useState(null);

  const [uploadContent, setUploadContent] = useState(null);

  const [initShopName, setInitShopName] = useState("");

  const [isUserExisted, setIsUserExisted] = useState(false);

  const [value, setValue] = useState("");

  const [validateLink, setValidateLink] = useState(true);

  useEffect(() => {
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
      history.go(1);
      setLeave(true);
      window.localStorage.setItem("popup-url", "/");
    };
    return () => {
      window.onpopstate = () => {
      };
    };
  }, []);
  useEffect(() => {
    window.onbeforeunload = () => {
      return "Dude, are you sure you want to leave? Think of the kittens!";
    };
    return () => {
      window.onbeforeunload = () => {
      };
    };
  }, []);

  const handleOnclick = (e) => {
    uploadContent.snsurl.forEach((sns, index) => {
      if (sns.type === e.target.value) {
        if (sns.isUsed) {
          uploadContent.snsurl[index].isUsed = false;
          setValue("");
        } else {
          uploadContent.snsurl[index].isUsed = true;
          setValue(sns.type);
        }
      } else uploadContent.snsurl[index].isUsed = false;
    });
  };

  const validateSocialLink = (e) => {
    const pattern = [
      /(?:http:\/\/)?(?:www\.)?twitter\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/,
    ];
    const twitterRule = new RegExp(pattern[0]);

    if (value == "twitter") {
      setValidateLink(twitterRule.test(e.target.value));
      updateSnsUrl({ type: value, url: e.target.value, isUsed: true });
    }
    setChanged(false);
  };

  const updateSnsUrl = ({ type, url, isUsed }) => {
    let newUploadContent = JSON.parse(JSON.stringify(uploadContent));
    uploadContent.snsurl.forEach((sns, index) => {
      if (type === sns.type) {
        newUploadContent.snsurl[index] = {
          type,
          url,
          isUsed,
        };
        setUploadContent(newUploadContent);
        setChanged(false);
      }
    });
  };

  const [validateAddUrl, setvalidateAddUrl] = useState(true);
  const validateUrl = (e) => {
    const pattern =
      /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

    const urlRule = new RegExp(pattern);
    let addUrlClone = { ...uploadContent.addurl };
    addUrlClone[e.target.id] = e.target.value;
    setChanged(false);
    if (e.target.value.length > 0) {
      setvalidateAddUrl(urlRule.test(e.target.value));
      if (urlRule.test(e.target.value)) {
        setUploadContent({
          ...uploadContent,
          addurl: addUrlClone,
        });
        setChanged(false);
      } else {
        setUploadContent({
          ...uploadContent,
          addurl: addUrlClone,
        });
        setChanged(false);
      }
    } else {
      setvalidateAddUrl(true);
      setUploadContent({
        ...uploadContent,
        addurl: addUrlClone,
      });
      setChanged(false);
    }
  };


  const shopNameChange = (e) => {
    const isValid =
      e.target.value.replace(/ +(?= )/g, "").length <= 60 &&
      e.target.value.replace(/\s/g, "").length > 0; //remove multiple whitespaces
    const isEmpty = e.target.value.replace(/\s/g, "") === ""; //remove all whitespaces
    if (
      isValid &&
      !isEmpty &&
      e.target.value.replace(/ +(?= )/g, "").trim() !== initShopName
    ) {
      setIsUserExisted(false);
      setUploadContent((uploadContent) => ({
        ...uploadContent,
        title: {
          ...uploadContent.title,
          content: e.target.value,
          isEmpty: isEmpty,
          isValid: isValid,
        },
      }));
      setChanged(false);
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

  const descriptionChange = (e) => {
    const isValid = e.target.value.length <= 500 && e.target.value.length >= 0;
    const isEmpty = e.target.value.replace(/\s/g, "") === "";
    if (isValid) {
      setUploadContent((uploadContent) => ({
        ...uploadContent,
        description: {
          ...uploadContent.description,
          isValid: isValid,
          isEmpty: isEmpty,
          content: e.target.value,
        },
      }));
      setChanged(false);
    } else {
      setUploadContent((uploadContent) => ({
        ...uploadContent,
        description: {
          ...uploadContent.description,
          isValid: isValid,
          isEmpty: isEmpty,
          content: e.target.value.slice(0, 500),
        },
      }));
    }
  };

  const validateShopDescription = (value) => {
    value = value.replace(/ +(?= )/g, "");
    setUploadContent((uploadContent) => ({
      ...uploadContent,
      description: {
        ...uploadContent.description,
        content: value,
        isEmpty: value === "",
        isValid: value !== "" && value.length <= 500,
      },
    }));
    return value !== "" && value.length <= 500;
  };

  const validateShopName = (value) => {
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
    return value !== "" && value.length < 60;
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
            setShopAvatar((episodeThumbnail) => ({
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
      setShopAvatar((episodeThumbnail) => ({
        ...episodeThumbnail,
        extClassname: isValid ? "convention-valid" : "convention-invalid",
      }));

    return isValid;
  };

  const validateThumbPicture = (width, height, size) => {
    setShopAvatar((episodeThumbnail) => ({
      ...episodeThumbnail,
      sizeClassname:
        size <= 10000000 ? "convention-valid" : "convention-invalid",
      ratioClassname:
        width === height ? "convention-valid" : "convention-invalid",
      widthClassname:
        width >= 0 && height >= 0 ? "convention-valid" : "convention-invalid",
    }));
  };

  const validateThumbEmpty = () => {
    const isEmpty =
      (episodeThumbnail.thumb === null ||
        episodeThumbnail.thumb.pictureAsFile === undefined) &&
      !currentAvatar;

    setShopAvatar((episodeThumbnail) => ({
      ...episodeThumbnail,
      isEmpty: isEmpty,
      errMsg: isEmpty ? t("create-series:inputShopAvatarAlert") : "",
    }));
  };

  const Upload = async () => {
    setIsLoading(true);
    const uploadSingleFile = (data): Promise<any> =>
      new Promise((res, rej) => {
        const form = new FormData();
        if (!data) {
          rej("Errorrr");
        }
        form.append("file", data);
      });

    const upload = episodeThumbnail.thumb
      ? await Promise.all([
        uploadSingleFile(episodeThumbnail.thumb.pictureAsFile),
      ])
      : null;

    let formdata = null;

    if (upload) {
      formdata = {
        shopName: uploadContent.title.content,
        avatar: upload[0].location,
        description: uploadContent.description.content,
        sns: uploadContent.snsurl,
        metalinks: uploadContent.addurl,
      };
    } else {
      formdata = {
        shopName: uploadContent.title.content,
        description: uploadContent.description.content,
        sns: uploadContent.snsurl,
        metalinks: uploadContent.addurl,
      };
    }
    CreatorInfo.editProfile({
      userInfo: GetUserInfo(),
      data: formdata
    }).then(data => {
      console.log({ data })
      notifySuccess(t("common:successMsg.editSuccess"));
    }).catch(err => {
      console.log({ err })
      notifyError(t("common:errorMsg.editFailed"));
    })
  };

  const validateAll = async () => {
    validateThumbEmpty();
    const isValidName = validateShopName(uploadContent.title.content);
    const isValidDes = validateShopDescription(
      uploadContent.description.content
    );
    let isValidSns = true;

    uploadContent.snsurl.forEach((item) => {
      if (item.isUsed && !item.url) {
        setValidateLink(false);
        isValidSns = false;
      }
    });
    if (
      !uploadContent.title.isEmpty &&
      uploadContent.title.isValid &&
      isValidName &&
      uploadContent.description.isValid &&
      isValidDes &&
      (!episodeThumbnail.isEmpty || currentAvatar) &&
      validateLink &&
      validateAddUrl &&
      !isUserExisted &&
      isValidSns
    ) {
      setIsLoading(true);
      Upload();
    } else {
      console.log("validate error");
    }
  };

  useEffect(() => {
    getCreatorData();
  }, []);
  const getCreatorData = () => {
    let currentData = JSON.parse(JSON.stringify(defaultData));

    CreatorInfo.getProfile({ userInfo: GetUserInfo() })
      .then((res) => {
        if (res) {
          if (res.fullName) {
            currentData.title = {
              content: res.fullName,
              isEmpty: false,
              isValid: true,
            };
            setInitShopName(res.fullName);
          }

          if (res.introduction) {
            currentData.description = {
              content: res.introduction,
              isEmpty: false,
              isValid: true,
            };
          }

          if (res.mediaLinks) {
            Object.keys(currentData.addurl).forEach((key, index) => {
              if (res.mediaLinks[index]) {
                currentData.addurl[key] = res.mediaLinks[index];
              }
            });
          }

          if (res.SNSplugin && res.SNSplugin.length > 0) {
            const currentSns = res.SNSplugin.map((sns) => {
              if (sns?.isUsed) setValue(sns?.snsName);
              return {
                type: sns?.snsName,
                url: sns?.link,
                isUsed: sns?.isUsed,
              };
            });
            currentData.snsurl = currentSns;
          }

          if (res.avatar) {
            setCurrentAvatar(res.avatar);
          }

          setUploadContent(currentData);
        }
      })
      .catch(() => {
        setUploadContent(currentData);
      });
  };

  return (
    <div style={{
      minHeight: "70vh",
    }}>
      {uploadContent && (
        <div
        >
          <Head>
            <title>WebtoonZ | {t("common:creatorProfile.editProfile")}</title>
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
              <div style={{}} className={`${style["edit-profile-content"]}`}>
                <div className={`${style["header-title"]}`}>
                  {t("common:creatorProfile.editProfile")}
                </div>
                <section className={`${style["shop-avatar"]}`}>
                  <div className={`${style["serie-detail-header"]}`}>
                    {t("shop:shopAvatar")}
                  </div>

                  <div className={`${style["thumbnail-detail"]}`}>
                    <PhotoUpload
                      className={"shop-avatar"}
                      startImage={currentAvatar}
                      setChanged={() => {
                        setChanged(false);
                      }}
                      setPagePicture={async ({ pictureAsFile, pictureSrc }) => {
                        if (pictureAsFile === undefined) {
                          setShopAvatar({
                            isEmpty: true,
                            thumb: null,
                            ratioClassname: "",
                            sizeClassname: "",
                            widthClassname: "",
                            extClassname: "",
                            errMsg: t("create-series:inputShopAvatarAlert"),
                          });
                          setCurrentAvatar(null);
                        } else {
                          let isValidated = await validateImage(
                            "thumb",
                            pictureAsFile.size,
                            pictureSrc,
                            pictureAsFile.name
                          );

                          if (isValidated) {
                            setShopAvatar((episodeThumbnail) => ({
                              ...episodeThumbnail,
                              thumb: { pictureAsFile },
                              errMsg: "",
                              isEmpty: false,
                            }));
                          } else
                            setShopAvatar((episodeThumbnail) => ({
                              ...episodeThumbnail,
                              thumb: null,
                            }));
                        }
                      }}
                      type="shop-avatar"
                      errorMsg={episodeThumbnail.errMsg}
                    />

                    <ul className={`${style["thumbnail-cover-convention"]}`}>
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
                <Form layout="vertical">
                  <Form.Item
                    label={t("shop:editAboutTerm.shopName")}
                    style={{ width: 731, marginBottom: 50 }}
                  >
                    <div
                      className={`${uploadContent.title.isEmpty ||
                        !uploadContent.title.isValid
                        ? "error-border"
                        : ""
                        }`}
                    >
                      <Input
                        placeholder={t("create-series:max60Charac")}
                        value={uploadContent.title.content}
                        onChange={shopNameChange}
                      />
                    </div>
                    {uploadContent.title.isEmpty ? (
                      <div className={`${style["error-msg-input"]}`}>
                        {t("shop:editAboutTerm.shopNameErr2")}
                      </div>
                    ) : (
                      <>
                        {!uploadContent.title.isValid && (
                          <div className={`${style["error-msg-input"]}`}>
                            {t("shop:editAboutTerm.shopNameErr")}
                          </div>
                        )}
                      </>
                    )}
                  </Form.Item>

                  <Form.Item
                    style={{
                      width: 731,
                    }}
                    label={t("shop:editAboutTerm.description")}
                  >
                    <div
                      className={`${!uploadContent.description.isValid ? "error-border" : ""
                        }`}
                    >
                      <TextArea
                        placeholder={t("shop:editAboutTerm.shopDesErr")}
                        autoSize={{ minRows: 4, maxRows: 5 }}
                        name="summary"
                        value={uploadContent.description.content}
                        onChange={descriptionChange}
                      />
                    </div>
                    {uploadContent.description.isEmpty ? (
                      <div className={`${style["error-msg-input"]}`}>
                        {t("shop:editAboutTerm.shopDesErr2")}
                      </div>
                    ) : (
                      <>
                        {!uploadContent.description.isValid && (
                          <div className={`${style["error-msg-input"]}`}>
                            {t("shop:editAboutTerm.shopDesErr")}
                          </div>
                        )}
                      </>
                    )}
                  </Form.Item>
                </Form>

                <section className={`${style["profile-box"]}`}>
                  <div
                    className={`${style["profile-option-header"]} ${style["episode-option"]}`}
                  >
                    {t("shop:editAboutTerm.SNSPlugin")}
                  </div>
                  <Radio.Group
                    onChange={(e) => {
                      if (e.target.value === value) {
                        setValue("");
                      } else {
                        setValue(e.target.value);
                      }
                    }}
                    value={value}
                    className={`${style["sns-container-box"]}`}
                  >
                    <Space
                      direction="vertical"
                      className={`${style["sns-container"]}`}
                    >
                      {uploadContent.snsurl.map((sns) => (
                        <Radio
                          value={sns.type}
                          className={`${style["sns-item"]}`}
                          onClick={handleOnclick}
                          checked={value === sns.type}
                          key={sns.type}
                        >
                          <div className={`${style["sns-item-container"]}`}>
                            <div className={`${style["sns-item-label"]}`}>
                              <img
                                src={`/assets/icons/${sns.type}.svg`}
                                alt={sns.type}
                              />
                              <div className={`${style["label"]}`}>
                                {sns.type.charAt(0).toUpperCase() +
                                  sns.type.slice(1)}
                              </div>
                            </div>

                            <Input
                              className={`${style["item-url"]}`}
                              placeholder={t("shop:editAboutTerm.enterUrl")}
                              disabled={value !== sns.type}
                              onChange={validateSocialLink}
                              value={sns.url}
                            />
                          </div>
                        </Radio>
                      ))}
                    </Space>
                  </Radio.Group>
                  {!validateLink && (
                    <div className={`${style["error-msg-input"]}`}>
                      {t("shop:editAboutTerm.socialUrlErr")}
                    </div>
                  )}
                </section>
                <section
                  className={`${style["add-url"]} ${style["profile-box"]}`}
                >
                  <div
                    className={`${style["profile-option-header"]} ${style["episode-option"]}`}
                  >
                    {t("shop:editAboutTerm.addURL")}
                  </div>
                  <div className={`${style["profile-option-convention"]}`}>
                    {t("shop:editAboutTerm.convention")}
                  </div>

                  {[...Array(5)].map((x, i) => (
                    <Row
                      className={`${style["url"]} ${style[i == 4 ? "disable-border" : ""]
                        }`}
                      key={i}
                    >
                      <Col span={8}>URL{i + 1}</Col>
                      <Col span={16} className={`${style["url-box"]}`}>
                        <Input
                          className={`${style["item-url"]}  ${style["add-item-url"]}`}
                          placeholder={t("shop:editAboutTerm.enterUrl")}
                          onChange={validateUrl}
                          value={uploadContent.addurl[`url${i + 1}`]}
                          id={`url${i + 1}`}
                        />
                      </Col>
                    </Row>
                  ))}
                  {!validateAddUrl && (
                    <div className={`${style["error-msg-input"]}`}>
                      {t("shop:editAboutTerm.socialUrlErr")}
                    </div>
                  )}
                </section>
              </div>
              <div className={`${style["custom-serie-btn"]}`}>
                <Button
                  className={`${style["button"]} ${style["active-save"]} ${style["confirm-button"]}`}
                  onClick={() => {
                    validateAll();
                    if (episodeThumbnail.errMsg !== "") scrollToTop();
                  }}
                  disabled={isLoading || changed}
                >
                  {changed ? t("shop:saved") : t("shop:save")}
                </Button>
              </div>
            </div>
          }

          {leave && <CustomCancelCreateNftModal updateModalVisible={setLeave} />}
        </div>)}
    </div>
  );
};
