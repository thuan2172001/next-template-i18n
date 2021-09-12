import { createCustomAxios } from '../../utils/custom-axios';
import { API_BASE_URL, CREATOR } from '../const';

const baseURL = API_BASE_URL;
const creator = CREATOR;

export default {
  getBookShelf: ({ serie, userInfo }) => {
    const customAxios = createCustomAxios(userInfo);

    return customAxios({
      method: 'get',
      url: `${baseURL}/customer/bookshelf?creator=${creator}`,
      params: { serie },
    }).then((data) => {
      return data;
    });
  },

  addFreeEpToBookshelf: ({ episodeId, userInfo }) => {
    const customAxios = createCustomAxios(userInfo);

    return customAxios({
      method: 'post',
      url: `${baseURL}/customer/bookshelf`,
      data: { episodeId },
    }).then((data) => {
      return data;
    });
  },
};
