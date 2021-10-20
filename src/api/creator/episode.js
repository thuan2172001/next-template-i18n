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
};
