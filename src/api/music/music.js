import {API_BASE_URL} from '../const';
import {createCustomAxios} from '../../utils/custom-axios';

const baseURL = API_BASE_URL;

export const getSerie = ({serieId, userInfo}) => {
    const customAxios = createCustomAxios(userInfo);
    return customAxios({
        method: 'get',
        url: `${baseURL}/listen/${serieId}`,
        params: {guest: !userInfo},
    }).then((data) => {
        return data;
    });
}

export const getMusic = ({serieId, episodeId, userInfo}) => {
    const customAxios = createCustomAxios(userInfo);
    return customAxios({
        method: 'get',
        url: `${baseURL}/listen/${serieId}/${episodeId}`,
        params: {guest: !userInfo},
    }).then((data) => {
        return data;
    });
};

export const getRemTime = ({userInfo, seriesId, episodeId}) => {
    console.log(seriesId, episodeId)
    const customAxios = createCustomAxios(userInfo);
    return customAxios({
        method: 'get',
        url: `${baseURL}/getRemTime`,
        params: {
            seriesId,
            episodeId
        },
    }).then((data) => {
        return data;
    });
}

export const updateRemTime = ({userInfo, seriesId, episodeId, time}) => {
    const customAxios = createCustomAxios(userInfo);
    return customAxios({
        method: 'post',
        url: `${baseURL}/updateRemTime`,
        data: {
            seriesId,
            episodeId,
            time
        },
    }).then((data) => {
        return data;
    });
}
