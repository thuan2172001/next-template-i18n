import { createCustomAxios } from '../../utils/custom-axios';
import { API_BASE_URL } from '../const';

const baseURL = API_BASE_URL;

export default {
	getCart: ({ userInfo }) => {
		const customAxios = createCustomAxios(userInfo);
		return customAxios({
			method: 'get',
			url: `${baseURL}/user/cart`,
		}).then((data) => {
			return data;
		});
	},

	getCartData: ({ userInfo }) => {
		const customAxios = createCustomAxios(userInfo);
		return customAxios({
			method: 'get',
			url: `${baseURL}/user/cart-data`,
		}).then((data) => {
			return data;
		});
	},

	updateCart: ({ userInfo, cartItems }) => {
		const customAxios = createCustomAxios(userInfo);
		return customAxios
			.put(`${baseURL}/user/cart`, {
				cartItems,
			})
			.then((data) => {
				return data;
			});
	},
};
