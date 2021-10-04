import { createCustomAxios } from '../../utils/custom-axios';
import { API_BASE_URL } from '../const';

const baseURL = API_BASE_URL;

export default {
  getSerieQuery: ({ userInfo, limit, page, isDaily, category, firstIndex = -1 , isPublished = null}) => {
    const customAxios = createCustomAxios(userInfo);
    return customAxios({
      method: 'get',
      url: `${baseURL}/serie`,
      params: {
        limit,
        page,
        isDaily,
        categoryId: category !== 'all' ? category : null,
        firstIndex,
        guest: !userInfo,
        isCreator: userInfo?.role === "creator",
        isPublished: isPublished
      },
    }).then((data) => {
      return data;
    });
  },
};


