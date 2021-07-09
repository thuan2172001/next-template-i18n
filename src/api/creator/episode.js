import { API_BASE_URL } from '../const';
import { createCustomAxios } from '../../utils/custom-axios';

const baseURL = API_BASE_URL;

export default {
  getEpisodeInfo: ({ userInfo, episodeId }) => {
    const customAxios = createCustomAxios(userInfo);

    return customAxios({
      method: 'get',
      url: `${baseURL}/edition/${episodeId}`,
    }).then((data) => {
      return data;
    });
  },

  handleEpisodePublishStatus: ({
    userInfo,
    action,
    episodeId,
    publishNumber = null,
    price = null,
  }) => {
    const customAxios = createCustomAxios(userInfo);

    return customAxios({
      method: 'put',
      url: `${baseURL}/edition/updateEdition`,
      data: {
        action,
        episodeId,
        publishNumber,
        price,
      },
    }).then((data) => {
      return data;
    });
  },

  createEpisode: ({ body, userInfo }) => {
    const customAxios = createCustomAxios(userInfo);
    return customAxios({
      method: 'post',
      url: `${baseURL}/episode`,
      data: body,
    }).then((data) => {
      return data;
    });
  },

  getCreateStatus: ({ userInfo }) => {
    const customAxios = createCustomAxios(userInfo);

    return customAxios({
      method: 'get',
      url: `${baseURL}/user/status`,
    }).then((data) => {
      return data;
    });
  },
};
