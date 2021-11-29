import { API_BASE_URL } from "../const";
import { createCustomAxios } from "../../utils/custom-axios";

const baseURL = API_BASE_URL;

export default {
  getProfile: ({ userInfo }) => {
    const customAxios = createCustomAxios(userInfo);
    return customAxios({
      method: "get",
      url: `${baseURL}/creator/profile`,
    }).then((data) => {
      return data;
    });
  },

  editProfile: ({ userInfo, data }) => {
    const customAxios = createCustomAxios(userInfo);
    return customAxios({
      method: "put",
      url: `${baseURL}/creator/profile`,
      data: data,
    }).then((data) => {
      return data;
    });
  },

  getTotalSale: ({ userInfo }) => {
    const customAxios = createCustomAxios(userInfo);
    return customAxios({
      method: "get",
      url: `${baseURL}/creator/sales`,
    }).then((data) => {
      return data;
    });
  },

  getAllTransaction: ({ userInfo, page, limit }) => {
    const customAxios = createCustomAxios(userInfo);
    return customAxios({
      method: "get",
      url: `${baseURL}/user/${userInfo._id}/transaction`,
    }).then((data) => {
      return data;
    });
  },
};
