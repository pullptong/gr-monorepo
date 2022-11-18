import axios from 'axios';

export const getHello = () => {
  return axios.get('/');
};
