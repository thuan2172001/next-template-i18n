import { API_BASE_URL } from '../const';
import { createCustomAxios } from '../../utils/custom-axios';

const baseURL = API_BASE_URL;

export default {
  verifyMail: ({ username, type }) => {
    console.log(username,type)
    const customAxios = createCustomAxios(null);
    return customAxios({
      method: 'post',
      url: `${baseURL}/sendVerifyEmail`,
      data: {
        username,
        type
      }
    }).then((data) => {
      return data;
    });
  },

  confirmActiveCode: ({ activeCode, userId }) => {
    const customAxios = createCustomAxios(null);
    return customAxios({
      method: 'post',
      url: `${baseURL}/sendOtpVerify`,
    }).then((data) => {
      return data;
    });
  },

  verifyCode: ({ activeCode, userId }) => {
    const customAxios = createCustomAxios(null);
    return customAxios({
      method: 'post',
      url: `${baseURL}/verifyCode`,
      data: {
        activeCode,
        userId
      }
    }).then((data) => {
      return data;
    });
  },

  getUserStatus: ({ username }) => {
    const customAxios = createCustomAxios(null);
    return customAxios({
      method: 'get',
      url: `${baseURL}/userStatus`,
      params: {
        username
      }
    }).then((data) => {
      return data;
    });
  },

  checkCodeExpired: ({ activeCode, userId }) => {
    const customAxios = createCustomAxios(null);
    console.log({activeCode, userId})
    return customAxios({
      method: 'get',
      url: `${baseURL}/checkCodeExpired`,
      params: {
        activeCode,
        userId
      }
    }).then((data) => {
      return data;
    });
  },
};
