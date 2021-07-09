import React, { useState, useEffect } from 'react';
import { Input } from '../../components/input';
import { Button } from 'antd';
import { useTranslation } from 'next-i18next';
import CustomerProfileAPI from '../../api/customer/profile';

const ForgotPasswordTemplate = (props) => {
	const { t } = useTranslation();

	const [isEmailsent, setIsEmailSent] = useState(false);
	const [email, setEmail] = useState('');
	const [isEmailValid, setIsEmailValid] = useState(true);
	const [isEmailExist, setIsEmailExist] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [countTime, setCountTime] = useState(0);

	const emailValidation = (value) => {
		setIsEmailValid(
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
		);

		return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([\w-]+\.)+[\w-]{2,4}$/.test(
			value
		);
	};

	const handleEmailSubmit = () => {
		setIsLoading(true);

		CustomerProfileAPI.sendEmailForgotPw({ email })
			.then((data) => {
				setIsLoading(false);
				setIsEmailSent(data.isSent);
			})
			.catch((err) => {
				console.log(err);

				setIsLoading(false);
			});
	};

	const handleResendEmail = () => {
		setIsLoading(true);
		setCountTime(60)
		CustomerProfileAPI.sendEmailForgotPw({ email })
			.then((data) => {
				setIsLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setIsLoading(false);
			});
	};

	const handleChangeEmail = (value) => {
		setEmail(value);

		emailValidation(value);

		if (emailValidation(value)) {
			CustomerProfileAPI.checkEmailExist({ email: value }).then((data) => {
				const { isExisted } = data;

				setIsEmailExist(isExisted);
			});
		}
	};

	const _renderErrorMessage = () => {
		if (email === '' || email.length === 0) return null;

		if (isEmailValid) {
			if (!isEmailExist) {
				return (
					<div className="edit-notify" style={{ color: '#D13434' }}>
						{t('account:notExistEmail')}
					</div>
				);
			}
		}

		if (!isEmailValid)
			return (
				<div className="edit-notify" style={{ color: '#D13434' }}>
					{t('account:invalidEmail')}
				</div>
			);
	};

	useEffect(() => {
		if (countTime > 0) {
			setTimeout(() => {
				setCountTime(countTime - 1);
			}, 1000);
		}
	}, [countTime]);

	return (
		<div>
			{isEmailsent ? (
				<div className="login-container">
					<div className="company-name text-uppercase">
						{' '}{t('common:header.companyName')}{' '}
					</div>
					<div className="forgot-password-title text-size-24">
						{' '}{t('common:forgotPassword')}
					</div>
					{countTime === 0 ?
						(<>
							<div className="not-receive-email">
								{t('account:notReceiveLink')}
								<Button
									type="link"
									className="atn-btn-link-login"
								>
									{t('account:resend')}
								</Button>
							</div>

							<div className="save-reset-password">
								<Button
									className="atn-btn-login atn-btn-color-orange"
									onClick={() => {
										handleResendEmail();
									}}
									loading={isLoading}>
									{t('account:resend')}
								</Button>
							</div>
						</>) : (
							<div className="text-count-time">
								{t('common:resendLinkMsg')} {' '}
								<div className="count-time">
									{countTime}
								</div>{' '}
								{t('common:seconds')}
							</div>)}
				</div>
			) : (
				<div className="login-container">
					<div className="company-name text-uppercase">
						{' '}
						{t('common:header.companyName')}{' '}
					</div>
					<div className="forgot-password-title text-size-24">
						{' '}{t('common:forgotPassword')}
					</div>

					<div className="reset-password-message">
						{t('account:forgotPasswordMessage')}
					</div>

					<Input
						value={email}
						className="atn-input-custom atn-input-login-form mrb-20px "
						placeholder="Your email address"
						autoComplete="off"
						onChange={(e) => {
							handleChangeEmail(e.target.value);
						}}
					/>

					{_renderErrorMessage()}

					<div className="save-reset-password">
						<Button
							className={`atn-btn-login atn-btn-color-orange ${email !== '' || isEmailValid ? 'save-active' : 'save-deactive'
								}`}
							onClick={() => {
								handleEmailSubmit();
							}}
							loading={isLoading}
							disabled={email === '' || !isEmailValid || !isEmailExist}>
							{t('account:next')}
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};

export default ForgotPasswordTemplate;
