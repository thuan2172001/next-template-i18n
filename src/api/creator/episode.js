import { API_BASE_URL } from "../const";
import { createCustomAxios } from "../../utils/custom-axios";

const baseURL = API_BASE_URL;

export default {
  createEpisode: ({ body, userInfo }) => {
    const customAxios = createCustomAxios(userInfo);
    return customAxios({
      method: "post",
      url: `${baseURL}/episode`,
      data: body,
    }).then((data) => {
      return data;
    });
  },

  editEpisode: ({ body, userInfo, episodeId }) => {
    const customAxios = createCustomAxios(userInfo);
    return customAxios({
      method: "put",
      url: `${baseURL}/episode/${episodeId}`,
      data: body,
    }).then((data) => {
      return data;
    });
  },

  handleEpisodePublishStatus: ({ body, userInfo }) => {
    const customAxios = createCustomAxios(userInfo);
    return customAxios({
      method: "post",
      url: `${baseURL}/episode/status`,
      data: body,
    }).then((data) => {
      return data;
    });
  },

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

  deleteEpisode: ({ userInfo, episodeId }) => {
    const customAxios = createCustomAxios(userInfo);
    return customAxios({
      method: 'delete',
      url: `${baseURL}/episode/${episodeId}`,
    }).then((data) => {
      return data;
    });
  },
};
