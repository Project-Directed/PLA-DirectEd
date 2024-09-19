import axios from 'axios';
import { config } from './config';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from the cookie
    const token = Cookies.get('token');
    
    // If token exists, add it to the headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { axiosInstance };