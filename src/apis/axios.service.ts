import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import {ApiConstant} from '../constants/admin';
import {ApiUtils} from '../utils';
import {setupInterceptorsTo} from './axios.interceptor';

export class AxiosService {
  private static instance: AxiosService;

  private axiosInstance: AxiosInstance;
  readonly baseUrl: string = ApiUtils.getUrl();

  constructor() {
    this.axiosInstance = setupInterceptorsTo(
      axios.create({
        baseURL: this.baseUrl,
        timeout: ApiConstant.TIME_DEFAULT.TIMEOUT_REQUEST * 1000,
      }),
    );
  }

  public static getInstance(): AxiosService {
    if (!AxiosService.instance) {
      AxiosService.instance = new AxiosService();
    }

    return AxiosService.instance;
  }

  delete<T>(path: string, config?: AxiosRequestConfig) {
    return this.axiosInstance.delete<T>(path, config);
  }

  get<T>(path: string, config?: AxiosRequestConfig) {
    return this.axiosInstance.get<T>(path, config);
  }

  post<T>(path: string, data: any, config?: AxiosRequestConfig) {
    return this.axiosInstance.post<T>(path, data, config);
  }

  patch<T>(path: string, data: any, config?: AxiosRequestConfig) {
    return this.axiosInstance.patch<T>(path, data, config);
  }
}
