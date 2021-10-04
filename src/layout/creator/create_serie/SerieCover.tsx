import React from "react";
import { NewFileUpload } from "@components/new-file-upload";

export const SerieCover = ({
  updateFile = null,
  isEmpty = false,
  first = true,
  type = "cover",
  currentCover = "",
}) => {
  return (
    <NewFileUpload
      className="serie-cover"
      setPagePicture={async ({ pictureAsFile }) => {
        updateFile({ cover: pictureAsFile });
      }}
      type={type}
      isEmpty={isEmpty}
      firstInit={first}
      currentCover={currentCover}
    />
  );
};
