import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:5555',
  withCredentials: true,
});
