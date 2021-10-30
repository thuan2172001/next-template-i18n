import { createCustomAxios } from 'src/utils/custom-axios';
import { API_BASE_URL, CREATOR } from '../const';

const baseURL = API_BASE_URL;
const creator = CREATOR;

export default {
  getSerieData: ({ serieId, userInfo }) => {
    const customAxios = createCustomAxios(userInfo);
    return customAxios({
      method: 'get',
      url: `${baseURL}/serie/${serieId}`,
      params: {
        guest: !userInfo,
      },
    }).then((data) => {
      return data;
    });
  },
};
