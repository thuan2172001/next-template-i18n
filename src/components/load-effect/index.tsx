import React, {useEffect, useState} from "react";
import Image from "next/image";
import LoaderGif from '../../../public/assets/images/loader.gif';
import style from './load-effect.module.scss';
export const LoadEffect = () => {
  return (
    <div className="loader-container">
      <div className="loader">
        <Image src={LoaderGif} />
      </div>
    </div>
  );
}