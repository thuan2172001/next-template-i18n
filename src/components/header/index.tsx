import React, { useEffect, useState } from "react";
import { Menu, Dropdown, Button } from "antd";
import Router, { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { GetUserInfo } from "src/api/auth";
import style from "./header.module.scss";
import { useSelector, useDispatch } from "react-redux";

export const Header = ({ triggerCreatorLogout = null }) => {
	const { t, i18n } = useTranslation();
	const router = useRouter();
	const [isLogged, setIsLogged] = useState(false);
	const [clientType, setClientType] = useState("");

	const dispatch = useDispatch();

	const totalItemsInCart = useSelector((state: any) => {
		let total = state.cart?.cartList.length || 0
		return total;
	});

	useEffect(() => {
		if (typeof window !== "undefined") {
			const userInfo = GetUserInfo();

			if (userInfo["encryptedPrivateKey"] && userInfo["publicKey"]) {
				setIsLogged(true);

				setClientType(userInfo.role);
			} else {
				setIsLogged(false);

				setClientType("");
			}
		}
	}, [])

	const handleLogout = async () => {
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


	const UserDropdownMenu = () => {
		return (
			<Menu className={`${style["dropdown-menu"]}`}>
				<Menu.Item key="1" onClick={() => router.push("/user/account")}>
					{t("common:header.dropdown.account")}
				</Menu.Item>
				<Menu.Item key="2" onClick={() => router.push("/user/bookshelf")}>
					{t("common:header.dropdown.bookshelf")}
				</Menu.Item>
				<Menu.Item
					key="4"
					onClick={() => router.push("/user/liked?category=all&liked=serie")}
				>
					{t("common:header.dropdown.liked")}
				</Menu.Item>
				<Menu.Item key="6"
					onClick={() => router.push("/user/transaction")}
				>
					{t("common:header.dropdown.purchaseHistory")}
				</Menu.Item>
				<Menu.Item
					key="8"
					onClick={() => {
						const locale = router?.locale || 'vi';
						const newLocale = locale === 'vi' ? 'en' : 'vi'
						i18n.changeLanguage(newLocale)
						router.push(`${router.asPath}`, `${router.asPath}`, { locale: newLocale })
					}}
				>
					{t("common:header.dropdown.changeLanguage")}
				</Menu.Item>
				<Menu.Item key="7" onClick={() => {
					localStorage.clear();
					router.push('/login')
				}}>
					{t("common:header.dropdown.logOut")}
				</Menu.Item>
			</Menu>
		);
	};


	const UserMenu = () => {
		return (
			<>
				<Menu.Item
					key="cart"
					className={`${style["disable-antd-css"]} ${style["ml-auto"]}`}
					style={{ position: "relative" }}
					onClick={() => { router.push('/user/cart') }}
				>
					{totalItemsInCart > 0 && (
						<div className={`${style["cart-number-badge"]}`}>
							{totalItemsInCart}
						</div>
					)}
					<img src="/assets/icons/cart.svg" />
				</Menu.Item>
				{isLogged ? (
					<Menu.Item
						key="user"
						className={`${style["right-item"]} ${style["disable-padding-left"]} ${style["disable-antd-css"]} ${style["padding-right-40"]}`}
					>
						<Dropdown
							overlay={UserDropdownMenu}
							trigger={["click"]}
							placement="bottomCenter"
						>
							<img src="/assets/icons/user.svg" />
						</Dropdown>
					</Menu.Item>
				) : (
					<Menu.Item
						key="sign-in"
						className={`${style["right-item"]} ${style["disable-padding-left"]} ${style["disable-antd-css"]}`}
						onClick={() => router.push("/login")}
					>
						{t("common:header.signIn")}
					</Menu.Item>
				)}
			</>
		);
	};

	const CreatorDropdownMenu = () => {
		return (
			<Menu className={`${style["dropdown-menu"]}`}>
				<Menu.Item
					key="3"
					onClick={() => {
						const locale = router?.locale || 'vi';
						const newLocale = locale === 'vi' ? 'en' : 'vi'
						i18n.changeLanguage(newLocale)
						router.push(`${router.asPath}`, `${router.asPath}`, { locale: newLocale })
					}}
				>
					{t("common:header.dropdown.changeLanguage")}
				</Menu.Item>
				<Menu.Item key="2" onClick={handleLogout}>
					{t("common:header.creator.dropdown.logOut")}
				</Menu.Item>
			</Menu>
		);
	};

	const handleMoveToSM = () => {
		router.push("/sm?view=public");
	};
	const handleMoveToEP = () => {

		router.push("/creator/edit-profile");
	};

	const handleMoveToShopSetting = () => {
		router.push("/shop-setting?tab=general-setting");
	};

	const handleMoveToUserMangement = () => {
		router.push("/creator/user-management");
	}


	const CreatorMenu = () => {
		return (
			<>
				<Menu.Item
					key="shopSetting"
					className={`${style["disable-antd-css"]} ${style["creator-sub-btn"]} ${style["padding-left-30"]}`}
					onClick={handleMoveToShopSetting}
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
					key="manageUsers"
					className={`${style["disable-antd-css"]} ${style["creator-sub-btn"]}`}
					onClick={handleMoveToUserMangement}
				>
					{t("common:header.creator.manageUsers")}
				</Menu.Item>
				<Menu.Item
					key="manageSales"
					className={`${style["disable-antd-css"]} ${style["creator-sub-btn"]}`}
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
						<img src="/assets/icons/c-homepage/creator_icon.svg" />
					</Dropdown>
				</Menu.Item>
			</>
		);
	};


	return (
		<>
			<Menu mode="horizontal" className={`${style["header"]}`}>
				<Menu.Item key="logo" className={`${style["disable-antd-css"]}`}>
					<Link href="/">
						<a>
							<img
								src="/assets/icons/logo.svg"
								className={`${style["logo-img"]}`}
							/>
							<span className={`${style["logo"]}`}>
								{t("common:header.appName")}
							</span>
						</a>
					</Link>
				</Menu.Item>

				{clientType === "creator" ? <CreatorMenu /> : <UserMenu />}
			</Menu>
		</>
	);
};
