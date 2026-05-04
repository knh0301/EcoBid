import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import { tokenStorage } from '../storage/tokenStorage';

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
    if (error.response && error.response.status === 401) {
      // 401 에러 발생 시 토큰을 삭제하고 필요 시 로그인 페이지로 이동하는 등의 로직을 처리할 수 있습니다.
      console.warn('Unauthorized request. Clearing tokens...');
      await tokenStorage.clearTokens();
      // TODO: 네비게이션을 이용해 로그인 화면으로 이동하는 로직 추가 가능
    }
    return Promise.reject(error);
  }
);

export default apiClient;
