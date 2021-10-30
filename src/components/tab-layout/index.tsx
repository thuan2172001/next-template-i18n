import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { GetUserInfo } from "src/api/auth";
import { useEffect } from "react";
import { useState } from "react";
import style from "./tab.module.scss";

const ActiveLink = ({ children, href, className }) => {
  const router = useRouter();
  return (
    <Link href={href} scroll={false}>
      <div
        className={`${
          style[router.pathname === href ? "tab-active" : "tab"]
        }`}
      >
        {children}
      </div>
    </Link>
  );
};

export const TabLayout = ({ type = "" }) => {
  const { t } = useTranslation();

  let isCheckingOut = type === "checkout";
  const [userInfo, setUserInfo] = useState("");

  useEffect(() => {
    setUserInfo(GetUserInfo()?.role?.role);
  }, [window?.localStorage?.userInfo]);

  return (
    <div className={`${style["layout"]}`}>
      {userInfo && (
        <ActiveLink href="/user/bookshelf" className={`${style["tab"]}`}>
          {t("common:tabLayout.bookshelf")}
        </ActiveLink>
      )}
      <ActiveLink
        href="/user/cart"
        className={isCheckingOut ? `${style["tab-active"]}` : `${style["tab"]}`}
      >
        {t("common:tabLayout.cart")}
      </ActiveLink>

      {userInfo && (
        <ActiveLink href="/user/account" className={`${style["tab"]}`}>
          {t("common:tabLayout.account")}
        </ActiveLink>
      )}
    </div>
  );
};
