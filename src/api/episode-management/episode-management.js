import { createCustomAxios } from '../../utils/custom-axios';
import { API_BASE_URL } from '../const';

const baseURL = API_BASE_URL;

export default {
  getAllEpisodes: ({ seriesId, isPublishing, userInfo, page = 1, limit = 6 }) => {
    const customAxios = createCustomAxios(userInfo);

    return customAxios({
      method: 'get',
      url: `${baseURL}/episode-management`,
      params: {
        seriesId,
        isPublishing,
        page,
        limit
      },
    }).then((data) => {
      return data;
    });
  },
};
