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

	getSettingRead: ({userInfo}) => {
		const customAxios = createCustomAxios(userInfo);

		return customAxios({
			method: 'get',
			url: `${baseURL}/setting-read`
		}).then((data) => {
			return data;
		});
	},

	updateSettingRead: ({userInfo, settingRead}) => {
		const customAxios = createCustomAxios(userInfo);

		return customAxios({
			method: 'post',
			url: `${baseURL}/setting-read`,
			data: {
				settingRead,
			},
		}).then((data) => {
			return data;
		});
	},

	sendEmailForgotPw: ({ email }) => {
		const customAxios = createCustomAxios(null);

		return customAxios({
			method: 'post',
			url: `${baseURL}/auth/forgot-password`,
			data: { email },
		}).then((data) => {
			return data;
		});
	},

	confirmForgotPw: ({ encryptedPrivateKey, publicKey, userId, codeId }) => {
		const customAxios = createCustomAxios(null);

		return customAxios({
			method: 'put',
			url: `${baseURL}/auth/reset-password`,
			data: { encryptedPrivateKey, publicKey, userId, codeId },
		}).then((data) => {
			return data;
		});
	},
};
