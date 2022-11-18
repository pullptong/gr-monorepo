import axios from 'axios';

axios.interceptors.request.use(
  async (config) => {
    if (config.url) {
      config.url = process.env.REACT_APP_API_URL + config.url;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);
