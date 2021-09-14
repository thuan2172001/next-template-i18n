import { combineReducers } from 'redux';
import cartReducer from './cartReducer';

const rootReducer = combineReducers({
	common: cartReducer,
});

export default rootReducer;
