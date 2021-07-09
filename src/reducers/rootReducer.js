import cartReducer from './cartReducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
	cart: cartReducer,
});

export default rootReducer;
