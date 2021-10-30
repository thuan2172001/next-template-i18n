import { createCustomAxios } from '../../utils/custom-axios';
import { API_BASE_URL } from '../const';

const baseURL = API_BASE_URL;

export default {
  like: ({ userInfo, episodeId = null, serieId = null }) => {
    const customAxios = createCustomAxios(userInfo);

    return customAxios({
      method: 'post',
      url: `${baseURL}/like/like`,
      data: { episodeId, serieId },
    }).then((data) => {
      return data;
    });
  },

  unlike: ({ userInfo, episodeId = null, serieId = null }) => {
    const customAxios = createCustomAxios(userInfo);

    return customAxios({
      method: 'post',
      url: `${baseURL}/like/unlike`,
      data: { episodeId, serieId },
    }).then((data) => {
      return data;
    });
  }
};
