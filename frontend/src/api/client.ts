import axios, {AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import { tokenStorage } from '../storage/tokenStorage';
import {refreshAuthTokens} from './authTokenManager';

/**
 * API 공통 인스턴스 생성
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * 요청 시 Access Token이 있으면 Authorization 헤더에 자동으로 첨부합니다.
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * 응답 처리 중 에러(특히 401 Unauthorized) 발생 시 공통 로직을 처리합니다.
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAuthTokens();

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
