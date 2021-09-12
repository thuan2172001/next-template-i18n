import React, { useEffect } from "react";
import style from "./noresult.module.scss";

export const NoResult = () => {

  return (
    <div className={`${style['noresult']}`}>
      <img src={'assets/NoResult.svg'} alt="no-result"/>
    </div>
  );
};
