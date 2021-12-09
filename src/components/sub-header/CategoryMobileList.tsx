import { Fragment } from 'react';
import style from './sub-header.module.scss';

interface CategoryMobileListinterface {
  list: any;
  handleClickItem: any;
}

export const CategoryMobileList = ({ list, handleClickItem }: CategoryMobileListinterface) => {
  return (
      <div className={`${style["overlay"]}`}>
        <div className={`${style['category-list']}`}>
          {list?.map((item, index) => {
            return (
              <div key={index} className={`${style['item']}`} onClick={handleClickItem(item)}>
                {item?.categoryName}
              </div>
            );
          })}
        </div>
      </div> 
  );
};
