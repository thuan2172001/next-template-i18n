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
    getSeriesInfo: ({userInfo, seriesId}) => {
        const customAxios = createCustomAxios(userInfo);
        return customAxios({
            method: "get",
            url: `${baseURL}/serie/${seriesId}`,
        }).then((data) => {
            return data;
        });
    },

    getAllEpisodes: ({userInfo, isPublished, limit, page, seriesId}) => {
        const customAxios = createCustomAxios(userInfo);

        return customAxios({
            method: "get",
            url: `${baseURL}/serie/${seriesId}/episodes`,
            params: {
                isCreator: userInfo?.role === "creator",
                isPublished: isPublished,
                limit: limit,
                page: page
            }
        }).then((data) => {
            return data;
        });
    },

    updateSeries: ({userInfo, body}) => {
        const customAxios = createCustomAxios(userInfo);

        return customAxios({
            method: "post",
            url: `${baseURL}/serie/status`,
            data: {
                type: body.type,
                serieId: body.serieId
            }
        }).then((data) => {
            return data;
        });
    }
};
