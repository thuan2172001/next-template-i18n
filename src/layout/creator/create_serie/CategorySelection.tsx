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
    setCategory({name: name, id: _id})
  };

  useEffect(() => {
    CategoriesAPI.getAllCategories().then((res) => {
      console.log(res);
      setCategoryList(res);
    });
  }, []);

  // useEffect(() => {
  //   let tmpSubcate = [];
  //
  //   if (subCates)
  //     subCates[category]?.forEach((el, index) => {
  //       tmpSubcate.push({
  //         id: el._id,
  //         name: el.name,
  //         index: index,
  //         isChosen:
  //           currentCategory === ""
  //             ? false
  //             : currentSubCategory.includes(el._id.toString()),
  //       });
  //     });
  //
  //   setSubCate(tmpSubcate);
  // }, [category, currentCategory !== "" && currentSubCategory]);
  //
  // const [isSubcateChosenEmpty, setIsSubcateChosenEmpty] = useState(false);
  //
  // useEffect(() => {
  //   let isNotChosenSubcate =
  //     subCate.filter((el) => el.isChosen === true).length === 0;
  //   setIsSubcateChosenEmpty(isNotChosenSubcate);
  // }, [subCate]);
  //
  // const chooseSubcate = (index) => {
  //   let tmpSubcate = [...subCate];
  //   tmpSubcate[index].isChosen = !tmpSubcate[index].isChosen;
  //   setSubCate(tmpSubcate);
  // };
  //
  // useEffect(() => {
  //   let tmpSubcateID = [];
  //   let tmpSubcateName = [];
  //   subCate.map((el) => {
  //     if (el.isChosen) {
  //       tmpSubcateID.push(el.id);
  //       tmpSubcateName.push(el.name);
  //     }
  //   });
  //   setSubcategory({subCate: tmpSubcateID, subCateNames: tmpSubcateName});
  // }, [subCate]);


  return (
    <div className={`${style["category"]}`}>
      <div className={`${style["header"]}`}>Category</div>
      <div className={`${style["cate-title"]}`}>
        Choose 1 of 4 categories below
      </div>

      <Space size={12} direction="horizontal">
        {categoryList?.map((el, index) => {
          return (
            <div
              key={index}
              className={`${style["serie-btn"]} ${el.categoryName === category.name && style["active"]}`}
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
                {el.categoryName}
                {el.categoryName === category.name && (
                  <div className={`${style["checked-icon"]}`}>
                    <Image src="/assets/icons/checked.svg" width={19} height={19}/>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </Space>
      {/*{!firstInit && category === "" && (*/}
      {/*  <div className={`${style["error-msg"]}`}>Please choose a category</div>*/}
      {/*)}*/}
    </div>
  );
};
