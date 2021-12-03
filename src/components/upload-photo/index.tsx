import Image from "next/image";
import { useTranslation } from "next-i18next";
import { useRef, useState, useEffect } from "react";
import style from "./upload-photo.module.scss";

export const PhotoUpload = ({
  className = "",
  setPagePicture,
  type = "",
  errorMsg = "",
  startImage = null,
  setChanged = null,
}) => {
  const { t } = useTranslation();

  const inputFile = useRef(null);

  const [picturePreview, setPicturePreview] = useState(null);

  const [first, setFirst] = useState(true);

  useEffect(() => {
    setPicturePreview(startImage);
  }, [startImage]);

  useEffect(() => {
    if (!first) {
      setPagePicture({});
      setPicturePreview(null);
      emptyInput();
    }
  }, [type, className]);

  const validateImage = (size, src, componentType, name) =>
    new Promise((resolve, reject) => {
      let lastDot = name.lastIndexOf(".");
      let ext = name.substring(lastDot + 1);
      if (ext !== "png" && ext !== "jpg" && ext !== "jpeg") {
        resolve(false);
      }
      if (size <= 10000000) {
        let width, height;
        let img = document.createElement("img");
        img.src = src;
        img.onload = () => {
          width = img.naturalWidth || img.width;
          height = img.naturalHeight || img.height;
          if (componentType === "thumb") {
            if (width !== height || width < 500) {
              resolve(false);
            }
          }
          resolve(true);
        };
      } else {
        resolve(false);
      }
    });

  const onFileChange = async (e) => {
    if (e.target.files.length !== 0) {
      let imgSrc = URL.createObjectURL(e.target.files[0]);
      let imgFile = e.target.files[0];
      let isValidated = await validateImage(
        imgFile.size,
        imgSrc,
        type,
        imgFile.name
      );
      if (type == "thumb") {
        window.localStorage.setItem("thumbnail", imgSrc);
      }
      if (isValidated) setPicturePreview(imgSrc);

      setFirst(false);

      setPagePicture({ pictureAsFile: imgFile, pictureSrc: imgSrc });
      setChanged();
    }
  };

  const onButtonClick = () => {
    inputFile.current.click();
  };

  const emptyInput = () => {
    inputFile.current.value = null;
  };

  return (
    <div className={`${style["cover-photo-upload"]} ${style[className]}`}>
      {picturePreview && (
        <div
          className={`${style["trash-icon"]}`}
          onClick={() => {
            setPicturePreview(null);
            setPagePicture({});
            emptyInput();
          }}
        >
          <Image src="/assets/icons/trash.svg" width={41} height={41} />
        </div>
      )}
      <div className={`${style["cover-photo-content"]}`}>
        <Image src="/assets/icons/cloud.png" height={74} width={74} />

        <div className={`${style["cover-photo-header"]}`}>
          {type === "cover" && <>{t("create-series:uploadCover")} </>}

          {type === "thumb" && <>{t("create-series:uploadImage")} </>}
        </div>

        <div className={`${style["cover-photo-subtitle"]}`}>
          <span
            className={`${style["text-color-pink"]}`}
            onClick={onButtonClick}
            style={{ cursor: "pointer" }}
          >
            {t("create-series:browse")}
          </span>{" "}
          {t("create-series:chooseFile")}
        </div>

        {type === "cover" && (
          <div className={`${style["cover-recommend"]}`}>
            {t("create-series:coverRecommend")}
          </div>
        )}

        <input
          type="file"
          id="file"
          ref={inputFile}
          onChange={(e) => {
            onFileChange(e);
          }}
          accept="image/png, image/jpg, image/jpeg"
          style={{ display: "none" }}
        />
        {errorMsg !== "" && (
          <div className={`${style["error-msg"]}`}>
            <Image src="/assets/icons/invalid.svg" height={24} width={24} />
            <div className={`${style["error-content"]}`}>{errorMsg}</div>
          </div>
        )}

        {picturePreview && (
          <div className={`${style["file-preview"]}`}>
            <img
              src={
                picturePreview
                  ? picturePreview
                  : window.localStorage.getItem("thumnail")
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};
