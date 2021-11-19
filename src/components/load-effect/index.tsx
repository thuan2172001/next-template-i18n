import React from "react";
import style from './load-effect.module.scss';
export const LoadEffect = () => {
  return (
    <div className={`${style["bookshelf_wrapper"]}`}>
      <ul className="books_list">
        <li className={`${style["book_item"]} ${style["first"]}`}/>
        <li className={`${style["book_item"]} ${style["second"]}`}/>
        <li className={`${style["book_item"]} ${style["third"]}`}/>
        <li className={`${style["book_item"]} ${style["fourth"]}`}/>
        <li className={`${style["book_item"]} ${style["fifth"]}`}/>
        <li className={`${style["book_item"]} ${style["sixth"]}`}/>
      </ul>
    </div>
  );
}