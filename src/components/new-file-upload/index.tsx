import Image from "next/image";
import { useTranslation } from "next-i18next";
import { useRef, useState, useEffect } from "react";
import style from "./upload-photo.module.scss";

export const NewFileUpload = ({
  className = "",
  setPagePicture,
  type = "",
  isEmpty = false,
  firstInit = true,
  setThumbConvention = null,
  currentCover = "",
}) => {
  const { t } = useTranslation();

  const inputFile = useRef(null);

  const [picturePreview, setPicturePreview] = useState(null);

  const [first, setFirst] = useState(firstInit);

  useEffect(() => {
    if (!first) {
      setPagePicture({});
      setPicturePreview(null);
    }
  }, [type]);

  useEffect(() => {
    if (currentCover !== "") {
      setPicturePreview(currentCover);
      if (type === "edit-cover")
        window.localStorage.setItem("cover-url", currentCover);
      if (type === "edit-thumb")
        window.localStorage.setItem("thumb-url", currentCover);
    }
  }, [currentCover]);

  const CreatorButton = (props) => {
    return (
      <div
        className={`${style["edit"]} ${style[`${props.className}`]} ${
          style["disable-select"]
        } ${style["ml-20"]}`}
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

  const UploadButton = (props) => {
    return (
      <div
        onClick={() => inputFile.current.click()}
        className={`${style["edit"]} ${style[`${props.className}`]} ${
          style["disable-select"]
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

  const validateImage = (size, src, componentType, ext) =>
    new Promise((resolve, reject) => {
      if (ext !== "png" && ext !== "jpg" && ext !== "jpeg") {
        if (type === "thumb" || type === "edit-thumb")
          setThumbConvention({
            sizeClassname: "",
            ratioClassname: "",
            widthClassname: "",
            extClassname: "convention-invalid",
          });
        resolve(false);
      }
      let width, height;
      let img = document.createElement("img");
      img.src = src;
      img.onload = () => {
        width = img.naturalWidth || img.width;
        height = img.naturalHeight || img.height;
        if (componentType === "thumb" || componentType === "edit-thumb") {
          validatThumbPicture(width, height, size, ext);
        }

        if (size <= 10000000) {
          if (componentType === "thumb" || componentType === "edit-thumb") {
            if (width !== height || width < 500) {
              resolve(false);
            }
          }
          resolve(true);
        } else {
          resolve(false);
        }
      };
    });

  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (!first || !firstInit) {
      if (isEmpty) {
        if (type === "cover" || type === "edit-cover")
          setErrMsg("Please upload series cover");
        else if (type === "thumb" || type === "edit-thumb") {
          setErrMsg("Please upload series thumbnail");
          setThumbConvention({
            sizeClassname: "",
            ratioClassname: "",
            widthClassname: "",
            extClassname: "",
          });
        }
      }
    }
  }, [isEmpty, firstInit]);

  const validateCoverPicture = (size, ext) => {
    let tmpMsg = "";

    if (ext !== "png" && ext !== "jpg" && ext !== "jpeg") {
      tmpMsg = tmpMsg.concat(t("create-series:coverExtAlert"));
    } else if (size > 10000000) {
      tmpMsg = tmpMsg.concat(t("create-series:convention3"));
    }

    setErrMsg(tmpMsg);
  };

  const validatThumbPicture = (width, height, size, ext) => {
    const extIsValid = ext === "png" || ext === "jpg" || ext === "jpeg";
    setThumbConvention({
      sizeClassname:
        size <= 10000000 ? "convention-valid" : "convention-invalid",
      ratioClassname:
        width === height ? "convention-valid" : "convention-invalid",
      widthClassname:
        width >= 500 && height >= 500
          ? "convention-valid"
          : "convention-invalid",
      extClassname: extIsValid ? "convention-valid" : "convention-invalid",
    });
  };

  const onFileChange = async (e) => {
    if (e.target.files.length !== 0) {
      let imgSrc = URL.createObjectURL(e.target.files[0]);
      let imgFile = e.target.files[0];

      let lastDot = imgFile.name.lastIndexOf(".");
      let ext = imgFile.name.substring(lastDot + 1);
      let isValidated = await validateImage(imgFile.size, imgSrc, type, ext);

      if (type === "cover" || type === "edit-cover")
        validateCoverPicture(imgFile.size, ext);

      if (isValidated) {
        setErrMsg("");
        setPicturePreview(imgSrc);
        setPagePicture({ pictureAsFile: imgFile });
        if (type === "cover" || type === "edit-cover")
          window.localStorage.setItem("cover-url", imgSrc);
        if (type === "thumb" || type === "edit-thumb")
          window.localStorage.setItem("thumb-url", imgSrc);
      } else {
        if (type === "edit-thumb" || type === "edit-cover") {
          setPicturePreview("");
          setPagePicture({ pictureAsFile: null });
        }
      }

      setFirst(false);
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
      {picturePreview &&
        (currentCover === "" ? (
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
        ) : (
          <div>
            <div className={`${style["edit-cover-mess"]}`}></div>
            {type !== "edit-thumb" && (
              <div className={`${style["guide-container"]}`}>
                <div className={`${style["big-guide"]}`}>
                  {t("common:editCover")}
                </div>

                <div className={`${style["small-guide"]}`}>
                  {t("common:replaceBanner.guideContent")}
                </div>
              </div>
            )}

            <div
              className={`${
                type === "edit-thumb"
                  ? style["edit-btn-thumb-container"]
                  : style["edit-btn-container"]
              }`}
            >
              <UploadButton
                imgSrc="/assets/icons/c-homepage/camera.svg"
                buttonName={t(`common:upload`)}
                className="edit-upload"
              />
              <CreatorButton
                imgSrc="/assets/icons/c-homepage/remove.svg"
                buttonName={t(`common:remove`)}
                className={``}
                onClickFunction={() => {
                  setPicturePreview(null);
                  setPagePicture({ pictureAsFile: null });
                  emptyInput();
                  if (type === "edit-cover")
                    setErrMsg("Please upload series cover");
                  else if (type === "edit-thumb") {
                    setErrMsg("Please upload series thumbnail");
                    setThumbConvention({
                      sizeClassname: "",
                      ratioClassname: "",
                      widthClassname: "",
                      extClassname: "",
                    });
                  }
                }}
              />
            </div>
          </div>
        ))}

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
        {errMsg !== "" && (
          <div className={`${style["error-msg"]}`}>
            <Image src="/assets/icons/invalid.svg" height={24} width={24} />
            <div className={`${style["error-content"]}`}>{errMsg}</div>
          </div>
        )}

        {picturePreview && (
          <div className={`${style["file-preview"]}`}>
            <img src={picturePreview} />
          </div>
        )}
      </div>
    </div>
  );
};
