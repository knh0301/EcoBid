import axios from 'axios';
import {API_CONFIG} from '../config/apiConfig';
import {tokenStorage} from '../storage/tokenStorage';
import {refreshAuthTokens} from './authTokenManager';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Axios 인스턴스 생성
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 요청 인터셉터: 토큰 자동 첨부
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
api.interceptors.request.use(async config => {
  const accessToken = await tokenStorage.getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 응답 인터셉터: 토큰 만료 시 자동 갱신
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAuthTokens();

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        await tokenStorage.clearTokens();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 타입
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export type UserProfile = {
  id: number;
  email: string;
  name: string;
  profileImage?: string | null;
  credits?: number;
  createdAt?: string;
  created_at?: string;
};

type AuthResponse = {
  user: UserProfile;
  accessToken: string;
  refreshToken: string;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Auth API 함수들
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const authApi = {
  // 회원가입
  register: async (payload: {
    email: string;
    password: string;
    name: string;
  }) => {
    const {data} = await api.post('/auth/register', payload);
    return data.data;
  },

  // 일반 로그인
  login: async (payload: {email: string; password: string}) => {
    const {data} = await api.post('/auth/login', payload);
    const result: AuthResponse = data.data;

    await tokenStorage.setAccessToken(result.accessToken);
    await tokenStorage.setRefreshToken(result.refreshToken);

    return result;
  },

  // 소셜 로그인
  socialLogin: async (payload: {
    email: string;
    name?: string;
    profileImage?: string;
    provider: 'GOOGLE' | 'KAKAO';
    providerId: string;
  }) => {
    const {data} = await api.post('/auth/social', payload);
    const result: AuthResponse = data.data;

    await tokenStorage.setAccessToken(result.accessToken);
    await tokenStorage.setRefreshToken(result.refreshToken);

    return result;
  },

  // 내 정보 조회
  getMe: async (): Promise<UserProfile> => {
    const {data} = await api.get('/auth/me');
    return data.data.user;
  },

  // 로그아웃
  logout: async () => {
    await api.post('/auth/logout');

    await tokenStorage.clearTokens();
  },

  // 토큰 갱신
  refresh: async (refreshToken: string) => {
    const {data} = await api.post('/auth/refresh', {refreshToken});
    return data.data;
  },
};

export default api;
