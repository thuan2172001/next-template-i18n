import React, { useEffect, useState } from "react";
import { Menu, Dropdown, Button } from "antd";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import style from "../header/header.module.scss";
import { useDispatch } from "react-redux";
import { GetUserInfo } from "src/api/auth";
import CustomerPaymentAPI from "../../api/customer/payment";

export const Header = ({ triggerCreatorLogout = null, leave, setLeave }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const dispatch = useDispatch();
  const [redirect, setRedirect] = useState(false);

  const [clientType, setClientType] = useState("");
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userInfo = GetUserInfo();

      if (userInfo["encryptedPrivateKey"] && userInfo["publicKey"]) {
        setIsLogged(true);

        setClientType(userInfo.role["role"]);
      } else {
        setIsLogged(false);

        setClientType("");
      }
    }
  }, []);

  const handleLogout = async () => {
    if (clientType !== "creator") {
      await CustomerPaymentAPI.deleteUnsavePayment({
        userInfo: GetUserInfo(),
      }).catch();
    }

    if (clientType === "customer")
      dispatch({ type: "UPDATE_CART", payload: [] });

    if (typeof window !== "undefined") {
      window.localStorage.removeItem("userInfo");
      window.localStorage.removeItem("creatorAvatar");
      window.localStorage.removeItem("thumbnail");
      window.localStorage.removeItem("cover-url");
      window.localStorage.removeItem("thumb-url");
      window.localStorage.removeItem("book-url");
    }
    window.localStorage.removeItem("checkPendingPayment");
    const _isFunction = (functionToCheck) => {
      return (
        functionToCheck &&
        {}.toString.call(functionToCheck) === "[object Function]"
      );
    };

    if (_isFunction(triggerCreatorLogout)) triggerCreatorLogout(true);

    if (router.pathname === "/") {
      setClientType("");
      router.reload();
    } else router.push("/");
  };

  const CreatorDropdownMenu = () => {
    return (
      <Menu className={`${style["dropdown-menu"]}`}>
        <Menu.Item key="1" onClick={handleMoveToShop}>
          {t("common:header.creator.dropdown.viewShop")}
        </Menu.Item>
        <Menu.Item key="2" onClick={handleLogout}>
          {t("common:header.creator.dropdown.logOut")}
        </Menu.Item>
      </Menu>
    );
  };

  const handleMoveToShop = () => {
    const creatorId = GetUserInfo()._id;
    // router.push(`/shop/${creatorId}`);
    setLeave(true);
    window.localStorage.setItem("popup-url", `/`);
  };

  const handleMoveToSM = () => {
    setLeave(true);
    window.localStorage.setItem("popup-url", "/sm?view=public");
  };
  const handleMoveToEP = () => {
    // const url = window.location.href
    if (router.pathname !== "/creator/edit-profile") {
      window.localStorage.setItem("popup-url", "/creator/edit-profile");
      setLeave(true);
    }
  };

  const CreatorMenu = () => {
    return (
      <>
        <Menu.Item
          key="shopSetting"
          className={`${style["disable-antd-css"]} ${style["creator-sub-btn"]} ${style["padding-left-30"]}`}
          onClick={handleMoveToSM}
        >
          {t("common:header.creator.shopSetting")}
        </Menu.Item>
        <Menu.Item
          key="manageItem"
          className={`${style["disable-antd-css"]} ${style["creator-sub-btn"]}`}
          onClick={handleMoveToSM}
        >
          {t("common:header.creator.manageItem")}
        </Menu.Item>
        <Menu.Item
          key="editProfile"
          className={`${style["disable-antd-css"]} ${style["creator-sub-btn"]}`}
          onClick={handleMoveToEP}
        >
          {t("common:header.creator.editProfile")}
        </Menu.Item>
        <Menu.Item
          key="manageSales"
          className={`${style["disable-antd-css"]} ${style["creator-sub-btn"]}`}
          onClick={handleMoveToEP}
        >
          {t("common:header.creator.manageSales")}
        </Menu.Item>
        <Menu.Item
          key="publish"
          className={`${style["disable-antd-css"]} ${style["ml-auto"]}`}
        >
          <Button
            className={`${style["creator-publish-btn"]}`}
            onClick={handleMoveToSM}
          >
            {t("common:header.creator.publish")}
          </Button>
        </Menu.Item>
        <Menu.Item
          key="user"
          className={`${style["right-item"]} ${style["disable-padding-left"]} ${style["disable-antd-css"]}`}
        >
          <Dropdown
            overlay={CreatorDropdownMenu}
            trigger={["click"]}
            placement="bottomCenter"
          >
            <img src="/icons/creator_icon.svg" />
          </Dropdown>
        </Menu.Item>
      </>
    );
  };

  return (
    <>
      <Menu mode="horizontal" className={`${style["header"]}`}>
        <Menu.Item key="logo" className={`${style["disable-antd-css"]}`}>
          <Link href="/?category=all">
            <a>
              <span className={`${style["logo"]}`}>
                {t("common:header.appName")}
              </span>
            </a>
          </Link>
        </Menu.Item>

        {clientType === "creator" ? <CreatorMenu /> : <></>}
      </Menu>
    </>
  );
};
