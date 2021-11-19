import { API_BASE_URL, CREATOR } from '../const';
import { createCustomAxios } from '../../utils/custom-axios';

const baseURL = API_BASE_URL;
const creator = CREATOR;

export default {
	createSetupIntent: ({ userInfo }) => {
		const customAxios = createCustomAxios(userInfo);
		return customAxios({
			method: 'get',
			url: `${baseURL}/payment/create-setup-intent`,
		}).then((data) => {
			return data;
		});
	},

	addPaymentMethod: ({
		userInfo,
		nameOnCard,
		paymentMethodInfo,
		futureUsage = true,
	}) => {
		const customAxios = createCustomAxios(userInfo);
		return customAxios({
			method: 'post',
			url: `${baseURL}/payment`,
			data: {
				nameOnCard,
				paymentMethodInfo,
				futureUsage,
			},
		}).then((data) => {
			return data;
		});
	},

	getAllPaymentMethod: ({ userInfo }) => {
		const customAxios = createCustomAxios(userInfo);

		return customAxios({
			method: 'get',
			url: `${baseURL}/payment`,
		}).then((data) => {
			return data;
		});
	},

	deletePaymentMethod: ({ userInfo, paymentMethodID }) => {
		const customAxios = createCustomAxios(userInfo);

		return customAxios({
			method: 'delete',
			url: `${baseURL}/payment/${paymentMethodID}`,
			data: {},
		}).then((data) => {
			return data;
		});
	},

	getApiKey: () => {
		const customAxios = createCustomAxios(null);
		return customAxios({
			method: 'get',
			url: `${baseURL}/user/api-key`,
		}).then((data) => {
			return data;
		});
	},

	checkout: ({ userInfo, cartList, paymentMethod, totalPrice }) => {
		const customAxios = createCustomAxios(userInfo);

		return customAxios({
			method: 'post',
			url: `${baseURL}/payment/checkout`,
			data: {
				cartList,
				payment: paymentMethod,
				currency: 'USD',
				value: totalPrice,
			},
		}).then((data) => {
			return data;
		});
	},

	getStatus: ({ userInfo }) => {
		const customAxios = createCustomAxios(userInfo);

		return customAxios({
			method: 'get',
			url: `${baseURL}/payment/status`,
		}).then((data) => {
			return data;
		});
	},
};
