import { API_BASE_URL } from "../const";
import { createCustomAxios } from "../../utils/custom-axios";

const baseURL = API_BASE_URL;

export default {
  getAllUser: ({ body, userInfo }) => {
    const customAxios = createCustomAxios(userInfo);
    return customAxios({
      method: "get",
      url: `${baseURL}/user`,
      params: body,
    }).then((data) => {
      return data;
    });
  },

  toggleBanUser: ({ body, userInfo }) => {
    const customAxios = createCustomAxios(userInfo);
    return customAxios({
      method: "put",
      url: `${baseURL}/user/${body.userId}/status`,
      data: { type: body.type },
    }).then((data) => {
      return data;
    });
  },
};
