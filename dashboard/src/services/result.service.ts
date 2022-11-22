import axios from 'axios';
import { CreateResultPayLoad, Result } from '../interfaces/result.interface';

export const getResults = () => {
  return axios.get<Result[]>('/results');
};

export const getResult = (id: number) => {
  return axios.get<Result>(`/results/${id}`);
};

export const deleteResult = (id: number) => {
  return axios.delete<Result>(`/results/${id}`);
};

export const createResult = (payload: CreateResultPayLoad) => {
  return axios.post('/results', payload);
};
