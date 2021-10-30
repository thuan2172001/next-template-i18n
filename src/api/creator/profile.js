import { API_BASE_URL } from "../const";
import { createCustomAxios } from "../../utils/custom-axios";

const baseURL = API_BASE_URL;

export default {
  getProfile: ({userInfo }) => {
    const customAxios = createCustomAxios(userInfo);
    return customAxios({
      method: "get",
      url: `${baseURL}/auth/profile`,
    }).then((data) => {
      return data;
    });
  },


};
