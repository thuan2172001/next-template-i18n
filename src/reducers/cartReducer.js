const initialCartState = {
	cartList: [],
	needMerge: true,
};

const cartReducer = (state = initialCartState, action) => {
	switch (action.type) {
		case 'UPDATE_CART':
			return { ...state, cartList: action.payload };

		case 'UPDATE_MERGE_REQUEST':
			return { ...state, needMerge: !state.needMerge };

		default:
			return state;
	}
};

export default cartReducer;
