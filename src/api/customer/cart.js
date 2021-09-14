import { createCustomAxios } from '../../utils/custom-axios';
import { API_BASE_URL } from '../const';

const baseURL = API_BASE_URL;

export default {
	getcommon: ({ userInfo }) => {
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

	// getCartCheckout: ({ userInfo }) => {
	// 	const customAxios = createCustomAxios(userInfo);
	// 	return customAxios({
	// 		method: 'get',
	// 		url: `${baseURL}/user/cart-checkout`,
	// 	}).then((data) => {
	// 		return data;
	// 	});
	// },

	updatecommon: ({ userInfo, cartItems }) => {
		const customAxios = createCustomAxios(userInfo);
		return customAxios
			.put(`${baseURL}/user/cart`, {
				cartItems,
			})
			.then((data) => {
				return data;
			});
	},

	// updateCartMutiple: ({ userInfo, cartInfo }) => {
	// 	const customAxios = createCustomAxios(userInfo);

	// 	return customAxios
	// 		.post(`${baseURL}/user/cart/multiple`, {
	// 			cartInfo,
	// 		})
	// 		.then((data) => {
	// 			return data;
	// 		});
	// },

	// toogleIsCheckcommon: ({ userInfo, cartItem }) => {
	// 	const customAxios = createCustomAxios(userInfo);
	// 	return customAxios
	// 		.post(`${baseURL}/user/cart/toggle-ischeck`, {
	// 			cartItem,
	// 		})
	// 		.then((data) => {
	// 			return data;
	// 		});
	// }
};
