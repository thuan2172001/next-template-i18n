import React, { useEffect, useState } from "react";
import { Menu } from "antd";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import style from "./sub-header.module.scss";
import { SearchBar2 } from "../../components/header-searchbar/index";
import { useWindowSize } from 'src/utils/custom-hook';
import CategoriesAPI from "../../api/category/category";
import { CategoryMobileList } from "./CategoryMobileList";

export const SubHeader = ({
    selectedCate,
    setSelectedCate,
}) => {
    const { t } = useTranslation();
    const [categories, setCategories] = useState([]);
    const { width } = useWindowSize();
    const [visibleCategoriesMobile, setVisibleCategoriesMobile] = useState(false);

    const handleVisibleCategoryMobile = () => {
        setVisibleCategoriesMobile(!visibleCategoriesMobile);
    };

    const handleClickCategoryMobile = (cate: any) => () => {
        handleVisibleCategoryMobile();
        setSelectedCate(cate._id);
        setSelectedCate('');
      };

    useEffect(() => {
        CategoriesAPI.getAllCategories().then((res) => {
            setCategories(res);
        });
    }, []);

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

                    {width > 500 && categories.map((cate) => {
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
                    {width <= 500 && (
                        <Menu.Item
                            className={`${style['active-item']} ${style['sub-item']} ${style['text-uppercase']} ${style['sub-hd-item']} ${style['category-item']}`}
                            key={'category'}
                            onClick={handleVisibleCategoryMobile}
                        >
                            {categories?.find((item) => item?._id === selectedCate)?.name || t('common:category.category')}
                        </Menu.Item>
                    )}
                    {visibleCategoriesMobile && !!categories?.length && (
                        <CategoryMobileList handleClickItem={handleClickCategoryMobile} list={categories} />
                    )}
                </Menu>
                <div className={`${style["search-box"]} ${style["ml-auto"]}`}>
                    <SearchBar2 />
                </div>

            </div>

        </>
    );
};
