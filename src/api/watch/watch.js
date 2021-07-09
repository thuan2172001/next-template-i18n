import { API_BASE_URL } from '../const';
import { createCustomAxios } from '../../utils/custom-axios';

const baseURL = API_BASE_URL;

export default {
  getSeries: ({ seriesId, userInfo }) => {
    const customAxios = createCustomAxios(userInfo);

    return customAxios({
      method: 'get',
      url: `${baseURL}/watch/${serieId}`,
      params: { guest: !userInfo },
    }).then((data) => {
      return data;
    });
  },
  getWatch: ({ seriesId, episodeId, userInfo }) => {
    console.log({seriesId, episodeId})
    const customAxios = createCustomAxios(userInfo);
    return customAxios({
      method: 'get',
      url: `${baseURL}/watch/${seriesId}/${episodeId}`,
      params: { guest: !userInfo },
    }).then((data) => {
      return data;
    });
  },
};
