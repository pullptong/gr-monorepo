import axios from 'axios';
import { Result } from '../interfaces/result.interface';

export const createResult = (result: Result) => {
  return axios.post('/results', result);
};
