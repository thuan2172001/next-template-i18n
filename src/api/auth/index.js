import { createCustomAxios } from '../../utils/custom-axios';
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
};

export const GetUserInfo = () => {
	if (typeof window !== 'undefined' && window.localStorage.userInfo) {
		return JSON.parse(window.localStorage.userInfo);
	} else return '';
};
