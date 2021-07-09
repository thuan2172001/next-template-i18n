import React, { useState } from 'react';
import { Input } from '../../components/input';
import UserAPI from '../../api/user';
import {
	SignMessage,
	SymmetricDecrypt,
} from 'src/api/auth/service/auth-cryptography';
import Router, { useRouter } from 'next/router';
import { Button, Row, Col } from 'antd';
import { useTranslation } from 'next-i18next';
import CustomerCartAPI from '../../api/customer/cart';
import CustomerEpisodeAPI from '../../api/customer/episode';
import { useSelector, useDispatch } from 'react-redux';
import VerifyEmailAuthen from '@components/verify-authentication/verifyEmailAuthen';
import VerifyGGAuthen from '@components/verify-authentication/verifyGGauthen';
import style from './login.module.scss'
import input from '../../components/input/input.module.scss'

const _convertCartList = (cartInfo) =>
	cartInfo
		.filter((e) => e.numberEdition > 0)
		.map((each: any) => ({
			srcImg: each.thumbnail,
			itemName: `${each.name} - Chapter ${each.chapter}`,
			numberEdition: each.numberEdition,
			price: each.price,
			cartItemId: each._id,
			remainEdition: each.remainEdition,
		}));

const _combineItemInfo = (item1, item2) => {
	if (!item1 && item2) return item2;

	if (item1 && !item2) return item1;

	if (item1.cartItemId !== item2.cartItemId) return null;

	const totalQuantity = item1.numberEdition + item2.numberEdition;

	return {
		...item1,
		...item2,
		numberEdition:
			totalQuantity < item1.remainEdition ? totalQuantity : item1.remainEdition,
	};
};

const _combineCart = (cartList1, cartList2) => {
	if (!Array.isArray(cartList1) || !Array.isArray(cartList2)) return [];

	const combineCartList = [...cartList1, ...cartList2];

	const distinctItemId = [
		...new Set(combineCartList.map((item) => item.cartItemId)),
	];

	return distinctItemId.map((itemId) => {
		const itemInCartList1 =
			cartList1.length > 0
				? cartList1.find((e) => e.cartItemId === itemId)
				: null;

		const itemInCartList2 =
			cartList2.length > 0
				? cartList2.find((e) => e.cartItemId === itemId)
				: null;

		return _combineItemInfo(itemInCartList1, itemInCartList2);
	});
};

const LoginTemplate = (props) => {
	const { t } = useTranslation();

	const storedCart = useSelector((state: any) => {
		return state.cart.cartList;
	});

	const router = useRouter();

	const [username, setUserName] = useState('');

	const [password, setPassWord] = useState('');

	const [notification, setNotification] = useState('');

	const [visibleVerifyEmail, setVisibleVerifyEmail] = useState(false);

	const [visibleVerifyGGAuth, setVisibleVerifyGGAuth] = useState(false);

	const [isEmailAuth, setIsEmailAuth] = useState(false);

	const [isGoogleAuth, setIsGoogleAuth] = useState(false);

	const [userInformation, setUserInformation] = useState(null);

	const [emailSignature, setEmailSignature] = useState('');

	const [googleSignature, setGoogleSignature] = useState('');

	const dispatch = useDispatch();

	const emailRule =
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	const handleLogin = () => {
		if (!username.match(emailRule) || password.length < 6) {
			setNotification(
				!username.match(emailRule)
					? t('common:loginInvalidEmail')
					: t('common:loginFailedMessage')
			);
			return;
		}
		UserAPI.credential({ username })
			.then((response) => {
				const {
					encryptedPrivateKey,
					publicKey,
					_id,
					isEmailAuthenEnable,
					isGoogleAuthenEnable,
					email,
				} = response;
				if (
					typeof encryptedPrivateKey !== 'string' ||
					encryptedPrivateKey.length <= 0
				) {
					setNotification(t('common:loginFailedMessage'));
					return;
				}
				const privateKey = SymmetricDecrypt(encryptedPrivateKey, password);
				if (!privateKey) {
					setNotification(t('common:loginFailedMessage'));
					return;
				}
				setIsEmailAuth(isEmailAuthenEnable);
				setIsGoogleAuth(isGoogleAuthenEnable);
				const certificateInfo = {
					username,
					timestamp: new Date().toISOString(),
					exp: 3600000,
				};
				const signature = SignMessage(privateKey, certificateInfo);
				const authorizationHeader = {
					signature,
					certificateInfo,
					publicKey,
				};

				const userInfo = {
					username,
					email,
					_privateKey: privateKey,
					_id,
					_certificate: authorizationHeader,
				};

				setUserInformation(userInfo);

				if (isEmailAuthenEnable) setVisibleVerifyEmail(true);
				else if (isGoogleAuthenEnable) setVisibleVerifyGGAuth(true);
				else ping(userInfo);
			})
			.catch((err) => {
				setNotification(t('common:loginFailedMessage'));
			});
	};

	const handleVerifyEmailSuccess = (res) => {
		if (isGoogleAuth) {
			setVisibleVerifyEmail(false);
			setVisibleVerifyGGAuth(true);
		} else {
			setVisibleVerifyEmail(false);
			ping(userInformation, res.signature);
		}
	};

	const handleVerifyGgAuthSuccess = (res) => {
		setVisibleVerifyGGAuth(false);
		ping(userInformation, emailSignature, res.signature);
	};

	const ping = (_userInfor, emailSignature = '', googleSignature = '') => {
		const certificateInfo = {
			username: _userInfor['username'],
			timestamp: new Date().toISOString(),
			exp: 3600000,
			emailSignature,
			googleSignature,
		};

		const signature = SignMessage(_userInfor['_privateKey'], certificateInfo);

		const authorizationHeader = {
			signature,
			certificateInfo,
			publicKey: _userInfor['_certificate']['publicKey'],
		};

		const _userInformation = {
			username,
			_privateKey: _userInfor['_privateKey'],
			_id: _userInfor['_id'],
			_certificate: authorizationHeader,
		};

		UserAPI.pingv2({
			data: _userInformation['_certificate'],
			userInfo: _userInformation,
		})
			.then(async (response) => {
				const data = response;

				if (!data) {
					Router.reload();
				}

				if (data.role?.role === 'customer') {
					const { cartItems = [] } = await CustomerCartAPI.getCart({
						userInfo: _userInformation,
					});

					const cartInDb = await Promise.all(
						cartItems.map(
							async ({ episode: cartItemId, quantity: numberEdition }) => {
								const response = await CustomerEpisodeAPI.getEpisodeInfo({
									userInfo: null,
									episodeId: cartItemId,
								});
								const item = response?.episode;

								return { ...item, numberEdition };
							}
						)
					);

					const cartInRedux = await Promise.all(
						storedCart.map(async ({ cartItemId, numberEdition }) => {
							const response = await CustomerEpisodeAPI.getEpisodeInfo({
								userInfo: '',
								episodeId: cartItemId,
							});

							const item = response?.episode;

							return { ...item, numberEdition };
						})
					);

					const cartInfo = _combineCart(
						_convertCartList(cartInDb),
						_convertCartList(cartInRedux)
					);

					await CustomerCartAPI.updateCartMutiple({
						userInfo: _userInformation,
						cartInfo: cartInfo.map((e) => ({
							episodeId: e.cartItemId,
							quantity: e.numberEdition,
						})),
					});

					dispatch({
						type: 'UPDATE_CART',
						payload: cartInfo,
					});
				}

				window.localStorage.setItem(
					'userInfo',
					JSON.stringify({
						...data,
						_privateKey: _userInformation['_privateKey'],
						_certificate: _userInformation['_certificate'],
					})
				);

				if (window.localStorage.getItem('nftRem')) {
					Router.push(window.localStorage.getItem('nftRem'));
					window.localStorage.removeItem('nftRem');
				} else Router.push('/');
			})
			.catch((err) => {
				setNotification(t('common:loginFailedMessage'));
			});
	};

	return (
		<div className={style['login-container']}>
			<div className={style['company-name']}>
				{' '}
				{t('common:header.companyName')}{' '}
			</div>
			<div className={style['signin-title']}> {t('common:signin')}</div>

			<div>
				<label>{t('common:emailAddress')}</label>
				<Input
					className={`${input['atn-input-custom']} ${input['atn-input-login-form']}  mrb-20px`}
					placeholder="Email Address"
					autoComplete="off"
					onChange={(e) => {
						setNotification('');
						setUserName(e.target.value);
					}}
					onPressEnter={handleLogin}
				/>
				<label>{t('common:password')}</label>
				<Input
					className={`${input['atn-input-custom']} ${input['atn-input-login-form']}`}
					placeholder="Password"
					autoComplete="off"
					type="password"
					onChange={(e) => {
						setNotification('');
						setPassWord(e.target.value);
					}}
					onPressEnter={handleLogin}
				/>
			</div>
			<div className={style['btn-forgot-pw']}>
				<Button
					type="link"
					className={style['atn-btn-link-login']}
					onClick={() => {
						Router.push('/forgot-password');
					}}>
					{t('common:forgotPw')}
				</Button>
			</div>

			<Row className={input['btn-controller']}>
				<Col>
					<Button
						type="link"
						className={style['atn-btn-register']}
						onClick={() => router.push('/signup')}>
						{t('common:createAccount')}
					</Button>
				</Col>
				<Col className={style['btn-controller-login']}>
					<Button
						className={`${style['atn-btn-login']} ${style['style.atn-btn-color-orange']}`}
						onClick={handleLogin}>
						{t('common:header.logIn')}
					</Button>
				</Col>
			</Row>

			<div className={style['login-form-error']}>{notification}</div>

			<VerifyEmailAuthen
				visible={visibleVerifyEmail}
				setVisible={setVisibleVerifyEmail}
				userInfo={userInformation}
				handleSuccess={handleVerifyEmailSuccess}
				setEmailSignature={(sig) => {
					setEmailSignature(sig);
				}}
			/>

			<VerifyGGAuthen
				visible={visibleVerifyGGAuth}
				setVisible={setVisibleVerifyGGAuth}
				userInfo={userInformation}
				handleSuccess={handleVerifyGgAuthSuccess}
				setGoogleSignature={setGoogleSignature}
			/>
		</div>
	);
};

export default LoginTemplate;
