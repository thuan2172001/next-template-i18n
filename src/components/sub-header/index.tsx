import React, {useEffect, useState} from "react";
import {Menu} from "antd";
import {useRouter} from "next/router";
import {useTranslation} from "next-i18next";
import style from "./sub-header.module.scss";
import {SearchBar2} from "../../components/header-searchbar/index";
import {useMemo} from "react";
import CategoriesAPI from "../../api/category/category";

export const SubHeader = ({
                              selectedCate,
                              setSelectedCate,
                              categoryId = null,
                          }) => {
    const {t} = useTranslation();
    const [categories, setCategories] = useState([]);

    const getKeyByValue = async (object, value) => {
        const result = await Object.keys(object).find(key => {
            return object[key].filter(ele => {
                return ele._id == value
            }).length > 0
        })
        return result || 'all'
    }

    useEffect(() => {
        CategoriesAPI.getAllCategories().then((res) => {
            console.log(res);
            setCategories(res);
        });
    }, []);

    // useMemo(async () => {
    //   if (categoryId) {
    //     console.log(categoryId)
    //     if (categories.filter(cate => cate._id == categoryId).length > 0) {
    //       console.log({ categoryId });
    //       setSelectedCate(categoryId)
    //     } else {
    //       const parentId = await getKeyByValue(subCategories, categoryId)
    //       console.log({ parentId, categoryId });
    //       if (parentId && parentId !== 'all' && categoryId) {
    //         setSelectedCate(parentId)
    //       }
    //     }
    //   }
    // }, [categoryId, categories])

    return (
        <>
            <div className={`${style["subheader-container"]}`}>
                <Menu
                    mode="horizontal"
                    className={`${style["sub-header-1"]} ${style["sub-header-b"]}`}
                >
                    <Menu.Item
                        className={`${style["sub-item"]} ${style["text-uppercase"]} ${style["sub-hd-item"]
                        } ${selectedCate == 'all' && style["active-item"]} ${style["all-category"]}`}
                        key="all-category"
                        onClick={() => {
                            setSelectedCate("all")
                        }}
                    >
                        {t("common:category.all")}
                    </Menu.Item>

                    {categories.map((cate) => {
                        console.log(cate.categoryName);
                        return (
                            <Menu.Item
                                className={`${selectedCate == cate.categoryId && style["active-item"]} ${style["sub-item"]
                                } ${style["text-uppercase"]} ${style["sub-hd-item"]}`}
                                key={cate.categoryId}
                                onClick={() => {
                                    setSelectedCate(cate.categoryId)
                                }}
                            >
                                {t(`common:category.${cate.categoryName}`)}
                            </Menu.Item>
                        );
                    })}

                </Menu>
                <div className={`${style["search-box"]} ${style["ml-auto"]}`}>
                    <SearchBar2/>
                </div>

            </div>

        </>
    );
};