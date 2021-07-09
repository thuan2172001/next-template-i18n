import { createCustomAxios } from '../../utils/custom-axios';
import { API_BASE_URL } from '../const';

const baseURL = API_BASE_URL;

export default {
  getAllSeries: ({ isPublishing, userInfo }) => {
    const customAxios = createCustomAxios(userInfo);

    return customAxios({
      method: 'get',
      url: `${baseURL}/series-management`,
      params: {
        isPublishing,
      },
    }).then((data) => {
      return data;
    });
  },
  putSeriesData: ({ seriesId, action, userInfo }) => {
    const customAxios = createCustomAxios(userInfo);
    return customAxios({
      method: 'put',
      url: `${baseURL}/series-management`,
      data: {
        action,
        seriesId,
      },
    }).then((data) => {
      return data;
    });
  },
};
