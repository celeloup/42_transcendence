import { Plugin } from '@nuxt/types';
import { AxiosRequestConfig } from 'axios';
import { initializeAxios } from '../utils/api';

const interceptor: Plugin = ({ app: { $axios, $cookies } }) => {
  initializeAxios($axios);

  $axios.onRequest((config: AxiosRequestConfig) => {
    if ($cookies.get('Expired') == undefined && $axios.getUri(config) !== '/authentication/refresh') {
      $axios.$get('/authentication/refresh', { withCredentials: true })
      .then((user) => {
        if (user) {
          return config;
        }
      })
    }
  });
}

export default interceptor;