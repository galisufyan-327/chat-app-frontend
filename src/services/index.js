import axios from "axios";

export const BASE_API_URL = process.env.REACT_APP_BACKEND_API_URL + '/api/v1';

export const authInterceptor = [
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
  
    if (accessToken && accessToken !== 'undefined') {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  },
];

export const Service = (url) =>
  axios.create({
    baseURL: BASE_API_URL + url,
  });

export const AuthorizedService = (url) => {
  const authorizedService = Service(url);
  authorizedService.interceptors.request.use(...authInterceptor);
  return authorizedService;
};
