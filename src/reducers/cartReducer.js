const initialCartState = {
	cartList: [],
	isCheckoutPending: false,
	needMerge: true,
};

const cartReducer = (state = initialCartState, action) => {
	switch (action.type) {
		case 'UPDATE_CART':
			return { ...state, cartList: action.payload };

		default:
			return state;
	}
};

export default cartReducer;
