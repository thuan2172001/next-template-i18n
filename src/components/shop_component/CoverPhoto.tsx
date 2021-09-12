import React, {useEffect, useState} from "react";
import style from "./cover-photo.module.scss";


export const CoverPhoto = ({coverImage}) => {

  return (
    <React.Fragment>
      <div className={`${style["image-cover-hidden"]} ${style["image-place"]}`}>
        <img src={coverImage ? coverImage : '/images/shop/sample-cover.svg'} width="100%" height="auto" />
      </div>
    </React.Fragment>
  );
};
