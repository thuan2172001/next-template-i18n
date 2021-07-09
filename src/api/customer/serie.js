import { createCustomAxios } from 'src/utils/custom-axios';
import { API_BASE_URL, CREATOR } from '../const';

const baseURL = API_BASE_URL;
const creator = CREATOR;

export default {
  getAll: ({userInfo}) => {
    const customAxios = createCustomAxios(userInfo);
    return customAxios({
      method: 'get',
      url: `${baseURL}/serie`,
      params: {
        creator,
        guest : !userInfo 
      },
    }).then((data) => {
      return data;
    });
  },

  unauthenticatedGetOne: ({ serieId }) => {
    const customAxios = createCustomAxios(null);
    return customAxios({
      method: 'get',
      url: `${baseURL}/serie/${serieId}`,
      params: {
        creator,
      },
    }).then((data) => {
      return data;
    });
  },
};
