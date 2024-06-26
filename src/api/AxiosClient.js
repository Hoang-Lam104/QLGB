import axios from 'axios';
import { AxiosClientConfig } from '../constains/api.constains';

const AxiosClient = axios.create({
  baseURL: AxiosClientConfig.DOMAIN_API,
  headers: {
    'Content-type': AxiosClientConfig.CONTENT_TYPE,
  },
});

AxiosClient.interceptors.request.use((config) => {
  if (localStorage.getItem('accessToken')) {
    (config.headers)['Authorization'] =
      AxiosClientConfig.AUTH_TYPES + ' ' + localStorage.getItem('accessToken') || '';
  }
  return config;
}, (error) => {
  return Promise.reject(error.response);
});

export default AxiosClient;