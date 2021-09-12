import React, {useEffect, useState} from "react";
import {Menu} from "antd";
import Router, {useRouter} from "next/router";
import {useTranslation} from "next-i18next";
import Link from "next/link";
import style from "./header.module.scss";

export const Header = ({triggerCreatorLogout = null}) => {
    const {t} = useTranslation();
    const router = useRouter();

    return (
        <>
            <Menu mode="horizontal" className={`${style["header"]}`}>
                <Menu.Item key="logo" className={`${style["disable-antd-css"]}`}>
                    <Link href="/">
                        <a>
                            <img
                                src="/assets/autharium_logo.svg"
                                className={`${style["logo-img"]}`}
                            />
                            <span className={`${style["logo"]}`}>
                {t("common:header.appName")}
              </span>
                        </a>
                    </Link>
                </Menu.Item>
                <Menu.Item
                    key="line"
                    className={`${style["disable-padding"]} ${style["ml-auto"]} ${style["disable-antd-css"]}`}
                >
                    <img src="/assets/line.svg"/>
                </Menu.Item>
                <Menu.Item
                    key="cart"
                    className={`${style["disable-antd-css"]}`}
                    onClick={() => router.push("/user/cart")}
                >
                    <img src="/assets/cart.svg"/>
                </Menu.Item>
                <Menu.Item
                    key="sign-in"
                    className={`${style["right-item"]} ${style["disable-padding-left"]} ${style["disable-antd-css"]}`}
                    onClick={() => router.push("/login")}
                >
                    {t("common:header.signIn")}
                </Menu.Item>
            </Menu>
        </>
    );
};
