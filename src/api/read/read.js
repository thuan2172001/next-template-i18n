import { createCustomAxios } from '../../utils/custom-axios';
import { API_BASE_URL } from '../const';

const baseURL = API_BASE_URL;

export default {
  getSerie: ({ serieId, userInfo }) => {
    const customAxios = createCustomAxios(userInfo);
    return customAxios({
      method: 'get',
      url: `${baseURL}/read/${serieId}`,
      params: { guest: !userInfo },
    }).then((data) => {
      return data;
    });
  },

  getRead: ({ serieId, episodeId, userInfo, page }) => {
    const customAxios = createCustomAxios(userInfo);
    return customAxios({
      method: 'get',
      url: `${baseURL}/read/${serieId}/${episodeId}`,
      params: { guest: !userInfo, page },
    }).then((data) => {
      return data;
    });
  },
};
