import { createCustomAxios } from '../../utils/custom-axios';
import { GenerateKeyPairAndEncrypt } from '../auth/service/auth-cryptography';
import { API_BASE_URL } from '../const';

const baseURL = API_BASE_URL;

export default {
	credential: ({ username }) => {
		const customAxios = createCustomAxios(null);
		return customAxios({
			method: 'post',
			url: `${baseURL}/auth/credential`,
			data: { username },
		}).then((response) => {
			return response;
		});
	},
	register: ({ displayName, username, password }) => {
		console.log({displayName})
		const { publicKey, encryptedPrivateKey } =
			GenerateKeyPairAndEncrypt(password);
		const customAxios = createCustomAxios(null);
		return customAxios({
			method: 'post',
			url: `${baseURL}/user`,
			data: {
				publicKey,
				displayName,
				username,
				encryptedPrivateKey,
			},
		}).then((data) => {
			return data;
		});
	},
	pingv2: ({ data, userInfo }) => {
		const customAxios = createCustomAxios(userInfo);
		return customAxios({
			method: 'post',
			url: `${baseURL}/auth/ping`,
			data: data,
		}).then((data) => {
			return data;
		});
	},

	generate2Fa: (userInfo) => {
		const customAxios = createCustomAxios(userInfo);
		return customAxios({
			method: 'get',
			url: `${baseURL}/customer/2fa/generate`,
		}).then((data) => {
			return data;
		});
	},

	confirmTurnOff2Fa: ({ userInfo }) => {
		const customAxios = createCustomAxios(userInfo);
		return customAxios({
			method: 'get',
			url: `${baseURL}/customer/2fa/confirm-turn-off`,
		}).then((data) => {
			return data;
		});
	},

	confirm2Fa: ({ userInfo, secret, otp }) => {
		const customAxios = createCustomAxios(userInfo);
		return customAxios({
			method: 'post',
			url: `${baseURL}/customer/2fa/confirm`,
			data: { secret, otp },
		}).then((data) => {
			return data;
		});
	},

	sendCodeVerifyEmail2Fa: ({ userInfo }) => {
		const customAxios = createCustomAxios(userInfo);

		return customAxios({
			method: 'get',
			url: `${baseURL}/customer/2fa/verify-email`,
		}).then((data) => {
			return data;
		});
	},

	confirmOtpEmail2Fa: ({ userInfo, confirmOtp, type }) => {
		const customAxios = createCustomAxios(userInfo);

		return customAxios({
			method: 'post',
			url: `${baseURL}/customer/2fa/confirm-email`,
			data: {
				otp: confirmOtp,
				type,
			},
		}).then((data) => {
			return data;
		});
	},

	sendCodeVerifyEmailAuth: ({ userInfo }) => {
		const customAxios = createCustomAxios(userInfo);

		return customAxios({
			method: 'get',
			url: `${baseURL}/customer/email-authentication/verify`,
		}).then((data) => {
			return data;
		});
	},

	guestSendCodeVerifyEmailAuth: ({ email }) => {
		const customAxios = createCustomAxios(null);

		return customAxios({
			method: 'post',
			url: `${baseURL}/customer/email-authentication/guest-verify`,
			data: { email },
		}).then((data) => {
			return data;
		});
	},

	confirmEmailAuthentication: ({ userInfo, confirmOtp, type = 'verify' }) => {
		const customAxios = createCustomAxios(userInfo);

		return customAxios({
			method: 'post',
			url: `${baseURL}/customer/email-authentication/confirm`,
			data: {
				otp: confirmOtp,
				type,
			},
		}).then((data) => {
			return data;
		});
	},

	guestConfirmEmailAuthentication: ({ email, otp }) => {
		const customAxios = createCustomAxios(null);

		return customAxios({
			method: 'post',
			url: `${baseURL}/customer/email-authentication/guest-confirm`,
			data: {
				otp,
				email,
			},
		}).then((data) => {
			return data;
		});
	},

	confirmGGAuthentication: ({ userInfo, confirmOtp }) => {
		const customAxios = createCustomAxios(userInfo);

		return customAxios({
			method: 'post',
			url: `${baseURL}/customer/gg-authentication/confirm`,
			data: {
				otp: confirmOtp,
			},
		}).then((data) => {
			return data;
		});
	},

	guestConfirmGGAuthentication: ({ email, otp }) => {
		const customAxios = createCustomAxios(null);

		return customAxios({
			method: 'post',
			url: `${baseURL}/customer/gg-authentication/guest-confirm`,
			data: {
				otp,
				email,
			},
		}).then((data) => {
			return data;
		});
	},
};

export const GetUserInfo = () => {
	if (typeof window !== 'undefined' && window.localStorage.userInfo) {
		return JSON.parse(window.localStorage.userInfo);
	} else return '';
};
