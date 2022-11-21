import axios from 'axios';
import { CreateResultPayLoad, Result } from '../interfaces/result.interface';

export const getResults = () => {
  return axios.get<Result[]>('/results');
};

export const createResult = (payload: CreateResultPayLoad) => {
  return axios.post('/results', payload);
};
