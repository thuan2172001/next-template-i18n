import React, { useState } from 'react';
import { Button, Row, Col, Input, Modal, Form } from 'antd';
import { useTranslation } from 'next-i18next';
import UserAPI from '../../api/user';

const VerifyGGAuthen = ({
	visible,
	setVisible,
	userInfo,
	handleSuccess,
	setGoogleSignature,
}) => {
	const [form] = Form.useForm();
	const [errorMessage, setErrorMessage] = useState('');
	const [securityCode, setSecurityCode] = useState('');

	const { t } = useTranslation();

	const handleSubmit = (event) => {
		event.preventDefault();

		if (securityCode.length != 6)
			return setErrorMessage(t('account:invalidSecuriryCode'));

		console.log(2222, {
			email: userInfo.email,
			otp: securityCode,
		});

		UserAPI.guestConfirmGGAuthentication({
			email: userInfo.email,
			otp: securityCode,
		})
			.then(async (response) => {
				if (!response.isVerified) {
					return setErrorMessage(t('account:invalidSecuriryCode'));
				} else {
					handleSuccess(response);
					setGoogleSignature(response.signature);
				}
			})
			.catch(() => {
				return setErrorMessage(t('account:invalidSecuriryCode'));
			});
	};

	return (
		<Modal
			visible={visible}
			footer={null}
			closable={false}
			onCancel={() => setVisible(false)}
			maskClosable={false}
			width={539}>
			<div className="modal-authen">
				<Form layout="vertical" onFinish={handleSubmit} form={form}>
					<div className="modal-header">{t('account:enterSecurityCode')}</div>
					<label>{t('account:googleAuthCode')}</label>
					<Input
						value={securityCode}
						onChange={(e) => {
							setErrorMessage('');
							setSecurityCode(e.target.value);
						}}
					/>

					<div className="text-color-red text-center p-t-10">
						{errorMessage}
					</div>

					<Row>
						<Col md={12} className="flex-center">
							<Form.Item>
								<Button
									className="footer-button cancel"
									onClick={() => setVisible(false)}>
									{t('account:cancel')}
								</Button>
							</Form.Item>
						</Col>

						<Col md={12} className="flex-center">
							<Form.Item>
								<Button
									className="footer-button save-active"
									onClick={handleSubmit}>
									{'Submit'}
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</div>
		</Modal>
	);
};

export default VerifyGGAuthen;
