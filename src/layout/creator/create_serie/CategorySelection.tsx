import React, {useEffect, useState} from "react";
import style from "./create-serie.module.scss";
import {Space} from "antd";
import {useTranslation} from "next-i18next";
import Image from "next/image";
import CategoriesAPI from "src/api/category/category";

export const CatagorySelection = ({
                                    firstInit = true,
                                    setCategory,
                                    category
                                  }) => {
  const {t} = useTranslation();

  const [categoryList, setCategoryList] = useState([])


  const chooseCate = (_id, name) => {
    setCategory({categoryName: name, categoryId: _id})
  };

  useEffect(() => {
    CategoriesAPI.getAllCategories().then((res) => {
      setCategoryList(res);
    });
  }, []);

  return (
    <div className={`${style["category"]}`}>
      <div className={`${style["header"]}`}>{t("create-series:category")}</div>
      <div className={`${style["cate-title"]}`}>
      {t("create-series:choose1of4")}
      </div>

      <Space size={12} direction="horizontal">
        {categoryList?.map((el, index) => {
          return (
            <div
              key={index}
              className={`${style["serie-btn"]} ${el.categoryName === category?.categoryName && style["active"]}`}
              onClick={() => {
                chooseCate(el.categoryId, el.categoryName);
              }}
            >
              <div
                className={`${style["radio-value"]}`}
                style={{
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                {t(`common:category.${el.categoryName}`)}
                {el.categoryName === category?.categoryName && (
                  <div className={`${style["checked-icon"]}`}>
                    <Image src="/assets/icons/checked.svg" width={19} height={19}/>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </Space>
    </div>
  );
};
