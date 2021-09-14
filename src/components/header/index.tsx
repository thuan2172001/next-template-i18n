import React, { useEffect, useState } from "react";
import { Menu, Dropdown, Button } from "antd";
import Router, { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { GetUserInfo } from "src/api/auth";
import style from "./header.module.scss";
import { useSelector, useDispatch } from "react-redux";

export const Header = ({ triggerCreatorLogout = null }) => {
	const { t } = useTranslation();
	const router = useRouter();
	const [isLogged, setIsLogged] = useState(false);

	const dispatch = useDispatch();

	const totalItemsInCart = useSelector((state: any) => {
		console.log(state)
		let total = state.cart?.cartList.length || 0
		return total;
	});

	useEffect(() => {
		if (typeof window !== "undefined") {
			const userInfo = GetUserInfo();

			if (userInfo["encryptedPrivateKey"] && userInfo["publicKey"]) {
				setIsLogged(true);

				// setClientType(userInfo.role["role"]);
			} else {
				setIsLogged(false);

				// setClientType("");
			}
		}
	}, [])

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
					key="3"
					onClick={() =>
						router.push(
							"/list-series/all?queryBy=newReleased&category=all&isDaily=true&tabNewRelease=following"
						)
					}
				>
					{t("common:header.dropdown.newArrivals")}
				</Menu.Item>
				<Menu.Item
					key="4"
					onClick={() => router.push("/user/liked?category=all&liked=serie")}
				>
					{t("common:header.dropdown.liked")}
				</Menu.Item>
				<Menu.Item key="6">
					{t("common:header.dropdown.purchaseHistory")}
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
					<img src="/assets/cart.svg" />
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
				<UserMenu />
			</Menu>
		</>
	);
};
