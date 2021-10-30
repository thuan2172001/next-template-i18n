import { USER_TYPES } from '../constants';

const isAuthenticatedUser = () => {
    return !!reduxStore && !!reduxStore.getState().User?.authInfo?.accessToken;
}

const isUserType = (userType) => {
    return isAuthenticatedUser && reduxStore.getState().User?.profile?.userType === USER_TYPES[userType];
}

export { 
    isAuthenticatedUser, 
    isUserType 
}
