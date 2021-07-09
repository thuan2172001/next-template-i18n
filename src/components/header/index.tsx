import React, { useEffect, useState } from 'react';
import { Menu, Dropdown } from 'antd';
import Router, { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { CustomButtonField as Button } from '@components/button';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import style from './header.module.scss';

export const Header = ({ triggerCreatorLogout = null }) => {
	const { t } = useTranslation();

	const dispatch = useDispatch();

	const router = useRouter();

	const totalItemsInCart = useSelector((state: any) => {
		if (!state.cart || !state.cart.cartList) return 0;

		let total = 0;

		for (let i = 0; i < state.cart.cartList.length; i++) {
			total += state.cart.cartList[i].numberEdition
				? state.cart.cartList[i].numberEdition
				: 0;
		}

		return total;
	});

	const [isLogged, setIsLogged] = useState(false);

	const [clientType, setClientType] = useState('');

	const renderMenuItem = () => {
		if (isLogged === false) {
			return (
				<>
					<Menu.Item key="divider">
						<hr className="header-divider" />
					</Menu.Item>
					<Menu.Item
						key="sign-in"
						className="left-sub-item">
						<button className="sign-in-button" onClick={handleClickSignin}>
							{t('common:header.signIn')}
						</button>
					</Menu.Item>

					<Menu.Item
						className="left-sub-item"
						key="sign-up">
						<button className="sign-up-button-wrapper">
							<span className="sign-up-button" onClick={handleClickSingUp}>{t('common:header.signUp')}</span>
						</button>
					</Menu.Item>
				</>
			);
		}

		if (isLogged === true) {
			switch (clientType) {
				case 'customer':
					return (
						<>
							<Menu.Item key="creator-detail" className="left-sub-item">
								<Dropdown
									overlay={accountTriggerMenu}
									trigger={['click']}
									placement="bottomCenter">
									<img src="/icons/account-icon.svg" />
								</Dropdown>
							</Menu.Item>
						</>
					);

				case 'creator':
					return (
						<>
							<Menu.Item key="log-out" className="left-sub-item">
								<Link href="/sm">
									<a>
										<Button classNames={['create-button']}>
											{t('common:header.publish')}
										</Button>
									</a>
								</Link>
							</Menu.Item>

							<Menu.Item key="account-detail" className="left-sub-item">
								<Dropdown
									overlay={accountTriggerMenu}
									trigger={['click']}
									placement="bottomCenter">
									<img src="/icons/account-icon.svg" />
								</Dropdown>
							</Menu.Item>
						</>
					);
			}
		}
	};

	let userInfo = JSON.parse(window.localStorage.getItem('userInfo'));

	useEffect(() => {
		if (typeof window !== 'undefined') {
			userInfo =
				window.localStorage && window.localStorage.getItem('userInfo')
					? JSON.parse(window.localStorage.getItem('userInfo'))
					: {};

			if (userInfo['encryptedPrivateKey'] && userInfo['publicKey']) {
				setIsLogged(true);

				setClientType(userInfo.role['role']);
			} else {
				setIsLogged(false);

				setClientType('');
			}
		}
	}, [userInfo]);

	const accountTriggerMenu = (
		<Menu className="header-dropdown">
			{clientType === 'customer' ? (
				<>
					<Menu.Item key="1">
						<Link href="/user/account">
							<a>{t('common:header.account')}</a>
						</Link>
					</Menu.Item>

					<Menu.Divider />

					<Menu.Item key="2">
						<Link href="/user/bookshelf">
							<a>{t('common:header.bookshelf')}</a>
						</Link>
					</Menu.Item>
				</>
			) : (
				<>
					<Menu.Item key="3">
						<Link href="/sm">
							<a>{t('common:header.contentManage')}</a>
						</Link>
					</Menu.Item>

					<Menu.Divider />

					<Menu.Item key="5">
						<Link href="/export-data">
							<a>{t('common:header.exportData')}</a>
						</Link>
					</Menu.Item>
				</>
			)}

			<Menu.Divider />

			<Menu.Item
				key="7"
				className="left-sub-item"
				onClick={() => handleLogout()}>
				{t('common:header.logOut')}
			</Menu.Item>
		</Menu>
	);

	const handleLogout = () => {
		const role = JSON.parse(window.localStorage.userInfo).role.role;

		if (role === 'customer') dispatch({ type: 'UPDATE_CART', payload: [] });

		if (typeof window !== 'undefined') {
			window.localStorage.removeItem('userInfo');
		}

		const _isFunction = (functionToCheck) => {
			return (
				functionToCheck &&
				{}.toString.call(functionToCheck) === '[object Function]'
			);
		};

		if (_isFunction(triggerCreatorLogout)) triggerCreatorLogout(true);

		Router.push('/');
	};

	const handleClickSignin = () => {
		Router.push('/login');
	};

	const handleClickSingUp = () => {
		Router.push('/signup');
	};

	const scrollTo = (sectionName) => {
		if (typeof window !== 'undefined') {
			const element = document.getElementById(`${sectionName}-section`);

			if (router.pathname !== '/') {
				window.localStorage.setItem('routeSection', sectionName);
				Router.push('/');
			}

			if (element) {
				const headerOffset = 60;

				window.scroll({
					top: element.offsetTop - headerOffset,
					behavior: 'smooth',
				});
			}
		}
	};

	return (
		<>
			<div style={{ height: 60 }}></div>
			<div>
				<Menu mode="horizontal" className="header">
					<Menu.Item
						className={`${style['lo-go']} ${style['bla']}`}
						key="logo"
						onClick={() => {
							router.push('/');

							scrollTo('home');
						}}>
						{t('common:header.companyName')}
					</Menu.Item>

					<Menu.Item
						className="sub-item text-uppercase"
						key="product"
						onClick={() => scrollTo('product')}>
						{t('common:section.product')}
					</Menu.Item>

					<Menu.Item
						className="sub-item text-uppercase"
						key="profile"
						onClick={() => scrollTo('profile')}>
						{t('common:section.profile')}
					</Menu.Item>

					<Menu.Item
						className="sub-item text-uppercase"
						key="support"
						onClick={() => scrollTo('support')}>
						{t('common:section.support.title')}
					</Menu.Item>

					<Menu.Item
						style={{
							marginLeft: 'auto',
							visibility: clientType === 'creator' ? 'hidden' : 'visible',
							position: 'relative',
						}}
						key="cart">
						<Link href="/user/cart">
							<a>
								<img src="/icons/cart-icon.svg" />
							</a>
						</Link>
						<div className="cart-number-badge">
							{totalItemsInCart > 0 && totalItemsInCart}
						</div>
					</Menu.Item>

					{renderMenuItem()}
				</Menu>
			</div>
		</>
	);
};
