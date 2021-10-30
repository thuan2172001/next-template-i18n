import { API_BASE_URL } from '../const';
import { createCustomAxios } from '../../utils/custom-axios';

const baseURL = API_BASE_URL;

export default {
  getEpisodeInfo: ({ userInfo, episodeId }) => {
    const customAxios = createCustomAxios(userInfo);
    return customAxios({
      method: 'get',
      url: `${baseURL}/episode/${episodeId}`,
      params: { guest: !userInfo },
    }).then((data) => {
      return data;
    });
  },
};
