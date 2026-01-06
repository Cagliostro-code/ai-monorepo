import { CommonResponse } from '@/types/request';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const request = axios.create({
  baseURL: './api',
  timeout: 20_000,
}) as RequestInstance;

request.interceptors.response.use(
  response => {
    const data = response.data;

    return data;
  },
  error => {
    console.error(error);
    return { status: false };
  },
);

export default request;

type RequestInstance = Omit<AxiosInstance, 'get' | 'post' | 'put' | 'delete'> & {
  get(url: string, config?: AxiosRequestConfig): Promise<CommonResponse>;
  post(url: string, data?: any, config?: AxiosRequestConfig): Promise<CommonResponse>;
  put(url: string, data?: any, config?: AxiosRequestConfig): Promise<CommonResponse>;
  delete(url: string, config?: AxiosRequestConfig): Promise<CommonResponse>;
};
