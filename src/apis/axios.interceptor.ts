import {AxiosError, AxiosHeaders, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import {ApiConstant} from '../constants/admin';

const onRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  // const token = '';
  // const domain = '';

  config.headers = new AxiosHeaders({
    ...config.headers,
    // Authorization: token,
    // Origin: ApiUtils.getOrigin(domain),
    'Content-Type': 'application/json',
  });

  if (config.params && config.params?.query) {
    config.params = {
      ...config.params,
      query: JSON.stringify(config.params.query),
    };
  }

  return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  return response;
};

export function setupInterceptorsTo(axiosInstance: AxiosInstance): AxiosInstance {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(
    response => onResponse(response.data),
    async (error: AxiosError) => {
      const {config: originalRequest, response} = error;
      if (response?.status === ApiConstant.HTTP_STATUS_CODE.UNAUTHORIZED && originalRequest) {
        //Handle logic when the token is expired
      }
    }
  )

  return axiosInstance;
}
