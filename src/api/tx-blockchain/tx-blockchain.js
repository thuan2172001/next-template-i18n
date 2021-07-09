import axios from 'axios';
import { createCustomAxios } from '../../utils/custom-axios';
import { API_BASE_URL } from '../const';

const baseURL = API_BASE_URL;

export default {
    getBlockChainDetail: ({ episodeId }) => {
        const customAxios = createCustomAxios(null);

        return customAxios({
            method: 'get',
            url: `${baseURL}/blockchain-detail`,
            params: {
                episodeId,
            },
        }).then((data) => {
            return data;
          });
    },
    getTransactionList: ({ episodeId, userInfo }) => {
        console.log(userInfo)
        const customAxios = createCustomAxios(userInfo);
        return customAxios({
            method: 'get',
            url: `${baseURL}/transaction`,
            params: {
                episodeId,
                guest: userInfo ? false : true,
            },
        }).then((data) => {
            return data;
          });
    },
    getTransactionDetail: async ({txh}) => {
        console.log(txh)
        return axios({
            method: 'GET',
            url: `https://scan.testnet.tomochain.com/api/txs/${txh}`,
        }).then((data) => {
            return data.data;
          });
    }
};
