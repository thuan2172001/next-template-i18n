import React, { useEffect, useState } from "react";
import style from "./create-serie.module.scss";
import { useTranslation } from "next-i18next";
import { NewFileUpload } from "@components/new-file-upload";

export const SerieThumbnail = ({
  updateFile = null,
  isEmpty = false,
  first = true,
  type = "thumb",
  currentThumb = "",
}) => {
  const { t } = useTranslation();

  const [convention, setConvention] = useState({
    sizeClass: "",
    ratioClass: "",
    widthClass: "",
    extClass: "",
  });

  const ThumbConvention = () => {
    return (
      <ul className={`${style["thumbnail-cover-convention"]}`}>
        <li
          className={`${style[convention.widthClass]} ${
            style["convention-item"]
          }`}
        >
          {t("create-series:convention1")}
        </li>
        <li
          className={`${style[convention.ratioClass]} ${
            style["convention-item"]
          }`}
        >
          {t("create-series:convention2")}
        </li>
        <li
          className={`${style[convention.sizeClass]} ${
            style["convention-item"]
          }`}
        >
          {t("create-series:convention3")}
        </li>
        <li
          className={`${style[convention.extClass]} ${
            style["convention-item"]
          }`}
        >
          {t("create-series:convention4")}
        </li>
      </ul>
    );
  };
  return (
    <div>
      <div className={`${style["header"]}`}>Series thumbnail</div>
      <div className={`${style["thumbnail-detail"]}`}>
        <NewFileUpload
          setPagePicture={async ({ pictureAsFile }) => {
            updateFile({ thumb: pictureAsFile });
          }}
          type={type}
          isEmpty={isEmpty}
          firstInit={first}
          currentCover={currentThumb}
          setThumbConvention={({
            sizeClassname,
            ratioClassname,
            widthClassname,
            extClassname,
          }) => {
            setConvention((convention) => ({
              ...convention,
              sizeClass: sizeClassname,
              ratioClass: ratioClassname,
              widthClass: widthClassname,
              extClass: extClassname,
            }));
          }}
        />
        <ThumbConvention />
      </div>
    </div>
  );
};
