import { createCustomAxios } from '../../utils/custom-axios';
import { API_BASE_URL } from '../const';

const baseURL = API_BASE_URL;

export default {
	getProfile: ({ userInfo }) => {
		const customAxios = createCustomAxios(userInfo);

		return customAxios({
			method: 'get',
			url: `${baseURL}/customer/profile`,
		}).then((data) => {
			return data;
		});
	},

	editUsername: ({ userInfo, username }) => {
		const customAxios = createCustomAxios(userInfo);

		return customAxios({
			method: 'post',
			url: `${baseURL}/customer/profile/username`,
			data: {
				username,
			},
		}).then((data) => {
			return data;
		});
	},

	checkUsernameAvailable: ({ username }) => {
		const customAxios = createCustomAxios(null);

		return customAxios({
			method: 'get',
			url: `${baseURL}/customer/profile/available?username=${username}`,
		}).then((data) => {
			return data;
		});
	},

	editPassword: ({
		userInfo,
		currentPassword,
		newPassword,
		publicKey,
		encryptedPrivateKey,
	}) => {
		const customAxios = createCustomAxios(userInfo);

		return customAxios({
			method: 'post',
			url: `${baseURL}/customer/profile/password`,
			data: {
				currentPassword,
				newPassword,
				publicKey,
				encryptedPrivateKey,
			},
		}).then((data) => {
			return data;
		});
	},

	checkEmailExist: ({ email }) => {
		const customAxios = createCustomAxios(null);

		return customAxios({
			method: 'post',
			url: `${baseURL}/customer/check-email-exist`,
			data: { email },
		}).then((data) => {
			return data;
		});
	},

	sendEmailForgotPw: ({ email }) => {
		const customAxios = createCustomAxios(null);

		return customAxios({
			method: 'post',
			url: `${baseURL}/customer/forgot-password/verify`,
			data: { email },
		}).then((data) => {
			return data;
		});
	},

	confirmForgorPw: ({ encryptedPrivateKey, publicKey, user, code }) => {
		const customAxios = createCustomAxios(null);

		return customAxios({
			method: 'post',
			url: `${baseURL}/customer/forgot-password/confirm`,
			data: { encryptedPrivateKey, publicKey, user, code },
		}).then((data) => {
			return data;
		});
	},
};