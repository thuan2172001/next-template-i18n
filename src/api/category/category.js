import { createCustomAxios } from '../../utils/custom-axios';
import { API_BASE_URL } from '../const';

const baseURL = API_BASE_URL;

export default {
  getAllCategories: () => {
    const customAxios = createCustomAxios();

    return customAxios({
      method: 'get',
      url: `${baseURL}/category`,
    }).then((data) => {
      return data;
    });
  },
};