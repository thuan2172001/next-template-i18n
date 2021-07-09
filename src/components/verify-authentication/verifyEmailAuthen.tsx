import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col, Input, Modal } from 'antd';
import { useTranslation } from 'next-i18next';
import UserAPI from '../../api/user';

const VerifyEmailAuthen = ({
	visible,
	setVisible,
	userInfo,
	handleSuccess,
	setEmailSignature,
}) => {
	const [form] = Form.useForm();

	const [confirmOtp, setConfirmOtp] = useState('');
	const [countTime, setCountTime] = useState(0);
	const [errorMessage, setErrorMessage] = useState('');

	const { t } = useTranslation();

	useEffect(() => {
		if (countTime > 0) {
			setTimeout(() => {
				let time = countTime - 1;
				setCountTime(time);
			}, 1000);
		}
	}, [countTime]);

	const sendEmailOtp = () => {
		if (!userInfo) return;
		UserAPI.guestSendCodeVerifyEmailAuth({ email: userInfo.email })
			.then((res) => {
				if (!res.isSent) {
					setErrorMessage(t('account:sendEmailFailed'));
					setCountTime(0);
				} else {
					setCountTime(60);
					setErrorMessage('');
					setConfirmOtp('');
				}
			})
			.catch(() => {
				setErrorMessage(t('account:sendEmailFailed'));
				setCountTime(0);
			});
	};

	const verifyEmailOtp = () => {
		if (!userInfo) return;
		UserAPI.guestConfirmEmailAuthentication({
			email: userInfo.email,
			otp: confirmOtp,
		})
			.then((res) => {
				if (res.isVerified) {
					setEmailSignature(res.signature);
					handleSuccess(res);
				} else {
					setErrorMessage(t('account:otpNotMatch'));
				}
			})
			.catch((err) => {
				console.log('err', err);
				setErrorMessage(t('account:otpNotMatch'));
			});
	};

	return (
		<Modal
			visible={visible}
			onCancel={() => setVisible(false)}
			footer={null}
			closable={false}
			maskClosable={false}
			width={539}>
			<div className="modal-authen">
				<Form layout="vertical" onFinish={verifyEmailOtp} form={form}>
					<div className="modal-header">{t('account:enterSecurityCode')}</div>
					<Row>
						<Col span={24}>
							<Form.Item label={t('account:emailAuthCode')}>
								<Input
									onChange={(e) => {
										setConfirmOtp(e.target.value);
										setErrorMessage('');
									}}
									value={confirmOtp}
									className="atn-input-custom atn-input-login-form stripe-element w-100"
									autoComplete="off"
									type="text"
									onPressEnter={verifyEmailOtp}
								/>
								{countTime === 0 ? (
									<Button
										type="link"
										className="button-send-mail"
										onClick={() => sendEmailOtp()}>
										{t('Send code to email')}
									</Button>
								) : (
									<div>
										<div className="text-center">
											We have sent you a code to your email.
										</div>
										<div className="text-center">
											You can resend code in{' '}
											<div className="text-color-red display-inline-block">
												{countTime}
											</div>{' '}
											seconds
										</div>
									</div>
								)}
								<div className="text-color-red text-center">{errorMessage}</div>
							</Form.Item>
						</Col>
					</Row>

					<Row>
						<Col span={12} className="flex-center">
							<Form.Item>
								<Button
									className={`footer-button cancel ${
										countTime > 0 ? 'm-t-0' : ''
									}`}
									onClick={() => setVisible(false)}>
									{t('account:cancel')}
								</Button>
							</Form.Item>
						</Col>

						<Col span={12} className="flex-center">
							<Form.Item>
								<Button
									className={`footer-button save-active ${
										countTime > 0 ? 'm-t-0' : ''
									}`}
									onClick={verifyEmailOtp}
									disabled={confirmOtp.length !== 6}>
									{t('account:submit')}
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</div>
		</Modal>
	);
};

export default VerifyEmailAuthen;
