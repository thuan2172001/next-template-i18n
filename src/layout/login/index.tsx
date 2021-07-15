import React, { useState } from 'react';
import UserAPI from '../../api/user';
import {
	SignMessage,
	SymmetricDecrypt,
} from 'src/api/auth/service/auth-cryptography';
import Router, { useRouter } from 'next/router';
import { Button, Row, Col, Input } from 'antd';
import { useTranslation } from 'next-i18next';
import style from './login.module.scss'

const LoginTemplate = (props) => {
	const { t } = useTranslation();

	const router = useRouter();

	const [username, setUserName] = useState('');

	const [password, setPassWord] = useState('');

	const [notification, setNotification] = useState('');

	const handleLogin = () => {
		if (username.length == 0 || password.length == 0) {
			setNotification(
				"Username or password is empty !"
			);
			return;
		}
		UserAPI.credential({ username })
			.then((response) => {
				const {
					encryptedPrivateKey,
					publicKey,
					id,
					mail,
				} = response;
				if (
					typeof encryptedPrivateKey !== 'string' ||
					encryptedPrivateKey.length <= 0
				) {
					setNotification(t('common:loginFailedMessage'));
					return;
				}
				console.log({ encryptedPrivateKey });

				const privateKey = SymmetricDecrypt(encryptedPrivateKey, password);
				if (!privateKey) {
					setNotification(t('common:loginFailedMessage'));
					return;
				}
				console.log({ privateKey });

				//change here
				const certificateInfo = {
					id,
					timestamp: new Date().toISOString(),
					exp: 2799360000000,
				};

				const signature = SignMessage(privateKey, certificateInfo);
				console.log({ signature });

				const authorizationHeader = {
					signature,
					certificateInfo,
					publicKey,
				};

				const userInfo = {
					username,
					mail,
					_privateKey: privateKey,
					_id: id,
					_certificate: authorizationHeader,
				};
				console.log({ userInfo });

				ping(userInfo);
			})
			.catch((err) => {
				setNotification(t('common:loginFailedMessage'));
			});
	};

	const ping = (_userInfor) => {
		const certificateInfo = {
			id: _userInfor['_id'],
			timestamp: new Date().toISOString(),
			exp: 2799360000000,
		};

		console.log({ _userInfor });
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

				window.localStorage.setItem(
					'userInfo',
					JSON.stringify({
						...data,
						_privateKey: _userInformation['_privateKey'],
						_certificate: _userInformation['_certificate'],
					})
				);

				Router.push('/');
			})
			.catch((err) => {
				setNotification(t('common:loginFailedMessage'));
			});
	};

	return (
		<div className={style["container"]}>
			<div className={style['margin-top-container']}></div>
			<div className={style['login-container']}>
				<div className={`${style['company-name']}`}>
					{' '}
					{t('common:header.appName')}{' '}
				</div>
				<div className={style['signin-title']}> {t('common:header.signIn')}</div>

				<div>
					<label>{t('common:userID')}</label>
					<Input
						className={`${style['ant-input-custom']} ${style['ant-input-login-form']}  mrb-20px`}
						placeholder="UserID"
						autoComplete="off"
						onChange={(e) => {
							setNotification('');
							setUserName(e.target.value);
						}}
						onPressEnter={handleLogin}
					/>
					<label>{t('common:password')}</label>
					<Input
						className={`${style['ant-input-custom']} ${style['ant-input-login-form']}`}
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
				<div className={style["forgot-password"]}>{t('common:forgotPw')}</div>
				<Row className={style['btn-controller']}>
					<div className={style['btn-controller-login']}>
						<Button
							className={`${style['ant-btn-login']}`}
							onClick={handleLogin}>
							{t('common:header.logIn')}
						</Button>
					</div>
				</Row>

				<div className={style['login-form-error']}>{notification}</div>
			</div>
		</div>
	);
};

export default LoginTemplate;
