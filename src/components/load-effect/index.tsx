import React, {useEffect, useState} from "react";
import Image from "next/image";
import LoaderGif from '../../../public/assets/images/loader.gif';
import style from './load-effect.module.scss';
export const LoadEffect = () => {
  return (
    <div className={`${style["bookshelf_wrapper"]}`}>
      <ul className="books_list">
        <li className={`${style["book_item"]} ${style["first"]}`}></li>
        <li className={`${style["book_item"]} ${style["second"]}`}></li>
        <li className={`${style["book_item"]} ${style["third"]}`}></li>
        <li className={`${style["book_item"]} ${style["fourth"]}`}></li>
        <li className={`${style["book_item"]} ${style["fifth"]}`}></li>
        <li className={`${style["book_item"]} ${style["sixth"]}`}></li>
      </ul>
    </div>
  );
}