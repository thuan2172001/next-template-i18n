import axios from 'axios';
import { NO_INTERNET } from '../constants';

let totalNoInternetRequest = 0;

const customAxios2 = axios.create();

customAxios2.interceptors.request.use(
    async config => {

        if (!window.navigator.onLine) {
            totalNoInternetRequest++;
            
            let cancelTokenSource = axios.CancelToken.source();
            config.cancelToken = cancelTokenSource.token;
    
            cancelTokenSource.cancel(NO_INTERNET);
        }

        return config; 
    },
    error => {
        Promise.reject(error)
    }
);

customAxios2.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (axios.isCancel(error)) {
            if (error.message === NO_INTERNET) {
                if (--totalNoInternetRequest === 0) {
                    window.dispatchEvent(new Event(NO_INTERNET));
                }

                return {
                    code: 0,
                    data: {},
                }
            }
        }

        const response = {
            code: 0,
            data: error?.response?.data?.message,
        };
        
        return response;
    }
);

export { customAxios2 };
