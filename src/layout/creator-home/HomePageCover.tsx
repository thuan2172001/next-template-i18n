import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "next-i18next";
import style from "./cover.module.scss";
import { Input, Button } from "antd";

const validateImage = (size, src, componentType, name): any =>
  new Promise((resolve) => {
    const lastDot = name.lastIndexOf(".");

    const ext = name.substring(lastDot + 1);

    if (ext !== "png" && ext !== "jpg" && ext !== "jpeg") {
      resolve({ isValid: false, reason: "INVALID_EXTENSION" });
    }

    if (size <= 10 * 1000000) {
      const img = document.createElement("img");

      img.src = src;

      img.onload = () => {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        if (height * 20 !== width * 9) {
          resolve({ isValid: false, reason: "INVALID_RATIO" });
        }

        if (componentType === "cover") {
          if (width < 720) {
            resolve({ isValid: false, reason: "INVALID_WIDTH" });
          }
        }
        resolve({ isValid: true });
      };
    } else {
      resolve({ isValid: false, reason: "INVALID_SIZE" });
    }
  });

export const HomePageCover = ({ creator }) => {
  const { t } = useTranslation();
  const [editBannerClicked, setEditBannerClick] = useState(false);
  const [cover, setCover] = useState(null);
  const [editBgColor, setEditBgColor] = useState(false);
  const [bgColor, setBgColor] = useState('#F0F0F0');
  const [isLoading, setLoading] = useState(false);
  const [coverFile, setCoverFile] = useState(null);
  const [action, setAction] = useState('');

  const inputFile = useRef(null);

  const UploadButton = (props) => {
    return (
      <div
        onClick={() => inputFile.current.click()}
        className={`${style["edit"]} ${style[`${props.className}`]} ${style["disable-select"]
          }`}
      >
        {props.imgSrc && (
          <div className={`${style["edit-icon"]}`}>
            <Image src={props.imgSrc} width={24} height={24} />
          </div>
        )}
        <div>{props.buttonName}</div>
      </div>
    );
  };

  const CreatorButton = (props) => {
    return (
      <div
        className={`${style["edit"]} ${style[`${props.className}`]} ${style["disable-select"]
          }`}
        onClick={props.onClickFunction}
      >
        {props.imgSrc && (
          <div className={`${style["edit-icon"]}`}>
            <Image src={props.imgSrc} width={24} height={24} />
          </div>
        )}
        <div>{props.buttonName}</div>
      </div>
    );
  };

  const [errorMessage, setErrorMessage] = useState("");

  const ErrorMessage = () => {
    return (
      <div className={`${style["error-message"]}`}>
        <div className={`${style["edit-icon"]}`}>
          <Image src="/assets/icons/c-homepage/alert.svg" width={24} height={24} />
        </div>
        <div>{errorMessage}</div>
      </div>
    );
  };

  const getErrorMessage = (errorMessage) => {
    switch (errorMessage) {
      case "INVALID_EXTENSION":
        setErrorMessage(t("common:replaceBanner.extAlert"));

        break;

      case "INVALID_WIDTH":
        setErrorMessage(t("common:replaceBanner.widthAlert"));

        break;

      case "INVALID_SIZE":
        setErrorMessage(t("common:replaceBanner.sizeAlert"));

        break;

      case "INVALID_RATIO":
        setErrorMessage(t("common:replaceBanner.ratioAlert"));

        break;

      case "INVALID_COLOR":
        setErrorMessage(t("common:replaceBanner.colorAlert"));

        break;

      default:
        setErrorMessage(t("common:replaceBanner.unknown"));
        break;
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    const imgSrc = URL.createObjectURL(e.target.files[0]);

    const check = await validateImage(file.size, imgSrc, "cover", file.name);

    if (!check || !check.isValid) {
      return getErrorMessage(check.reason)
    }
    setErrorMessage('');
    setCoverFile(file);
    setCover(imgSrc)
    setAction('update');
  }

  const handleSaveCover = async () => {
    if (action === 'update') handleUpdateCover();
    else if (action === 'reset') handleResetCover();
    if (action === '') {
      setEditBannerClick(!editBannerClicked)
      setErrorMessage('')
    }
  }

  const handleUpdateCover = async () => {
    try {
      setLoading(true);

      const imgSrc = URL.createObjectURL(coverFile);

      const check = await validateImage(coverFile.size, imgSrc, "cover", coverFile.name);

      if (!check || !check.isValid) {
        return getErrorMessage(check.reason)
      }

      const formData = new FormData();

      formData.append("file", coverFile);
    } catch (error) {
      getErrorMessage(error.message)
      setCover(creator ? creator.cover : 'https://nftjapan-backup.s3.ap-northeast-1.amazonaws.com/image/be3bc26a-565e-499b-aa69-967baa1c6fdb-KEY%20VUSUAL%201.png');
      setLoading(false);
      setAction('');
      setEditBannerClick(!editBannerClicked);
    }
  };

  const handleResetCover = () => {
    setAction('')
    setEditBannerClick(!editBannerClicked);
  }

  const resetBanner = () => {
    setAction('reset')
    setCover('https://nftjapan-backup.s3.ap-northeast-1.amazonaws.com/image/be3bc26a-565e-499b-aa69-967baa1c6fdb-KEY%20VUSUAL%201.png');
  };

  const [inputColor, setInputColor] = useState("");
  const validateColor = (value) => {
    const pattern = /^#[0-9A-F]{6}$/i;
    const hexColorRule = new RegExp(pattern);

    return hexColorRule.test(value) && value.length === 7 && setBgColor(value);
  };

  const updateBackgroundColor = (color) => {
    const pattern = /^#[0-9A-F]{6}$/i;
    const hexColorRule = new RegExp(pattern);

    if (!hexColorRule.test(color) || color.length !== 7)
      return getErrorMessage('INVALID_COLOR')
  }

  useEffect(() => {
    creator && setCover(creator.cover);
    creator && creator.profileColor && creator.profileColor.backgroundBannerColor && setBgColor(creator.profileColor.backgroundBannerColor)
  }, [creator]);

  return (
    <>
      <section
        className={`${style["image-cover-hidden"]} ${style["image-place"]}`}
        style={bgColor ? { backgroundColor: bgColor } : {}}
      >
        {errorMessage !== "" && <ErrorMessage />}
        <img src={cover && cover} width="100%" style={{ overflow: 'hidden', maxHeight: '430px' }} />

        <CreatorButton
          imgSrc="/assets/icons/c-homepage/camera.svg"
          buttonName={t(`common:editBanner`)}
          className="edit-banner"
          onClickFunction={() => setEditBannerClick(!editBannerClicked)}
        />
        <CreatorButton
          buttonName={t(`common:changeColor`)}
          className="change-color"
          onClickFunction={() => setEditBgColor(!editBgColor)}
        />

        {editBannerClicked && (
          <>
            <div className={`${style["background-banner"]}`}></div>

            <div className={`${style["guide-container"]}`}>
              <div className={`${style["big-guide"]}`}>
                {t("common:replaceBanner.header")}
              </div>

              <div className={`${style["small-guide"]}`}>
                {t("common:replaceBanner.guideContent")}
              </div>
            </div>

            <div className={`${style["edit-btn-container"]}`}>
              {!isLoading && (
                <UploadButton
                  imgSrc="/assets/icons/c-homepage/camera.svg"
                  buttonName={t(`common:upload`)}
                  className="edit-upload"
                />
              )}

              {/* <MoonLoader color={"#ffffff"} loading={isLoading} size={60} /> */}

              <input
                type="file"
                onChange={(e) => handleFileChange(e)}
                ref={inputFile}
                style={{ display: "none" }}
              />

              {!isLoading && (
                <CreatorButton
                  imgSrc="/assets/icons/c-homepage/remove.svg"
                  buttonName={t(`common:remove`)}
                  className="edit-remove"
                  onClickFunction={() => resetBanner()}
                />
              )}
            </div>
            <CreatorButton
              buttonName={t(`common:save`)}
              className="edit-banner"
              onClickFunction={() => handleSaveCover()}
            />
          </>
        )}
      </section>
    </>
  );
};
