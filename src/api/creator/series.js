import { API_BASE_URL } from "../const";
import { createCustomAxios } from "../../utils/custom-axios";

const baseURL = API_BASE_URL;

export default {
    uploadFile: ({ formdata, userInfo }) => {
        const customAxios = createCustomAxios(userInfo);
        return customAxios({
            method: "post",
            url: `${baseURL}/upload`,
            data: formdata,
        }).then((data) => {
            return data;
        });
    },
    createSeries: ({ body, userInfo }) => {
        const customAxios = createCustomAxios(userInfo);
        return customAxios({
            method: "post",
            url: `${baseURL}/serie`,
            data: body,
        }).then((data) => {
            return data;
        });
    },
};