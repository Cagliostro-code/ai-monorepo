import axios from 'axios';

export const request = axios.create({
  baseURL: './api',
  timeout: 20_000,
});
