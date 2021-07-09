import { API_BASE_URL, CREATOR } from '../const';
import { createCustomAxios } from '../../utils/custom-axios';

const baseURL = API_BASE_URL;

export default {
	getCover: ({ userInfo }) => {
		const customAxios = createCustomAxios(userInfo);

		return customAxios({
			method: 'get',
			url: `${baseURL}/setting/cover?creator=${CREATOR}`,
		}).then((data) => {
			return data;
		});
	},

	setCover: ({ userInfo, cover }) => {
		const customAxios = createCustomAxios(userInfo);

		return customAxios({
			method: 'post',
			url: `${baseURL}/setting/cover`,
			data: {
				cover,
			},
		}).then((data) => {
			return data;
		});
	},

	resetCover: ({ userInfo }) => {
		const customAxios = createCustomAxios(userInfo);

		return customAxios({
			method: 'delete',
			url: `${baseURL}/setting/cover`,
			data: {},
		}).then((data) => {
			return data;
		});
	},

	exportTransactionsData: ({ userInfo, from, to }) => {
		const customAxios = createCustomAxios(userInfo);

		return customAxios({
			method: 'get',
			url: `${baseURL}/creator/export/transaction`,
			params: { from, to },
		}).then((data) => {
			return data;
		});
	},
};
