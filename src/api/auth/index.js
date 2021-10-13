import { createCustomAxios } from '../../utils/custom-axios';
import { API_BASE_URL } from '../const';
import {GenerateKeyPairAndEncrypt} from "./service/auth-cryptography";

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

	getProfile: ({ userInfo }) => {
		const customAxios = createCustomAxios(userInfo);
		return customAxios({
			method: 'get',
			url: `${baseURL}/auth/profile`,
		}).then((data) => {
			return data;
		});
	},

	saveProfile: ({ userInfo, profile }) => {
		const customAxios = createCustomAxios(userInfo);
		return customAxios({
			method: 'put',
			url: `${baseURL}/user/${userInfo._id}`,
			data: profile,
		}).then((data) => {
			return data;
		});
	},

	signup: ({ user_name, email, full_name, password }) => {
		const {publicKey, encryptedPrivateKey} = GenerateKeyPairAndEncrypt(password)
		const customAxios = createCustomAxios(null);
		return customAxios({
			method: 'post',
			url: `${baseURL}/user`,
			data: { username: user_name, email, fullName: full_name, publicKey, encryptedPrivateKey },
		}).then((response) => {
			return response;
		});
	},
};

export const GetUserInfo = () => {
	if (typeof window !== 'undefined' && window.localStorage.userInfo) {
		return JSON.parse(window.localStorage.userInfo);
	} else return '';
};


