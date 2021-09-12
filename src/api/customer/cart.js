import { createCustomAxios } from '../../utils/custom-axios';
import { API_BASE_URL } from '../const';

const baseURL = API_BASE_URL;

export default {
	getCart: ({ userInfo }) => {
		const customAxios = createCustomAxios(userInfo);
		return customAxios({
			method: 'get',
			url: `${baseURL}/customer/cart`,
		}).then((data) => {
			return data;
		});
	},

	getCartCheckout: ({ userInfo }) => {
		const customAxios = createCustomAxios(userInfo);
		return customAxios({
			method: 'get',
			url: `${baseURL}/customer/cart-checkout`,
		}).then((data) => {
			return data;
		});
	},

	updateCart: ({ userInfo, episodeId, quantity }) => {
		const customAxios = createCustomAxios(userInfo);
		return customAxios
			.post(`${baseURL}/customer/cart`, {
				episodeId,
				quantity,
			})
			.then((data) => {
				return data;
			});
	},

	updateCartMutiple: ({ userInfo, cartInfo }) => {
		const customAxios = createCustomAxios(userInfo);

		return customAxios
			.post(`${baseURL}/customer/cart/multiple`, {
				cartInfo,
			})
			.then((data) => {
				return data;
			});
	},

	toogleIsCheckCart: ({ userInfo, cartItem }) => {
		const customAxios = createCustomAxios(userInfo);
		return customAxios
			.post(`${baseURL}/customer/cart/toggle-ischeck`, {
				cartItem,
			})
			.then((data) => {
				return data;
			});
	}
};
