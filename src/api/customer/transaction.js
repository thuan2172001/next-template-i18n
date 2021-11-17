import { API_BASE_URL, CREATOR } from "../const";
import { createCustomAxios } from "../../utils/custom-axios";

const baseURL = API_BASE_URL;
const creator = CREATOR;

export default {
  getAllTransactions: ({ userInfo, page, limit }) => {
    console.log(page, limit);
    const customAxios = createCustomAxios(userInfo);
    return customAxios({
      method: "get",
      url: `${baseURL}/user/${userInfo._id}/transaction`,
      params: {
        page,
        limit,
      },
    }).then((data) => {
      return data;
    });
  },
};
