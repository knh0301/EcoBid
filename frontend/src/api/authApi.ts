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
        const refreshToken = await tokenStorage.getRefreshToken();

        if (!refreshToken) {
          return Promise.reject(error);
        }

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
  nickname?: string | null;
  studentId?: string | null;
  department?: string | null;
  profileImage?: string | null;
  provider?: 'LOCAL' | 'GOOGLE' | 'KAKAO';
  credits?: number;
  createdAt?: string;
  created_at?: string;
};

type AuthResponse = {
  user: UserProfile;
  accessToken: string;
  refreshToken: string;
};

type PasswordResetRequestResponse = {
  expiresAt: string;
  resetCode?: string;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

const getApiOrigin = () => API_CONFIG.BASE_URL.replace(/\/api\/?$/, '');

export const resolveProfileImageUrl = (profileImage?: string | null) => {
  if (!profileImage) {
    return undefined;
  }

  if (
    profileImage.startsWith('http://') ||
    profileImage.startsWith('https://') ||
    profileImage.startsWith('file://')
  ) {
    return profileImage;
  }

  if (profileImage.startsWith('/')) {
    return `${getApiOrigin()}${profileImage}`;
  }

  return profileImage;
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
    nickname: string;
    studentId: string;
    department: string;
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

  googleLogin: async (payload: {accessToken?: string; idToken?: string}) => {
    const {data} = await api.post('/auth/google', payload);
    const result: AuthResponse = data.data;

    await tokenStorage.setAccessToken(result.accessToken);
    await tokenStorage.setRefreshToken(result.refreshToken);

    return result;
  },

  requestPasswordReset: async (payload: {
    email: string;
  }): Promise<PasswordResetRequestResponse> => {
    const {data} = await api.post<ApiResponse<PasswordResetRequestResponse>>(
      '/auth/password-reset/request',
      payload,
    );

    return data.data;
  },

  resetPassword: async (payload: {
    email: string;
    code: string;
    password: string;
  }): Promise<void> => {
    await api.post('/auth/password-reset/confirm', payload);
  },

  // 내 정보 조회
  getMe: async (): Promise<UserProfile> => {
    const {data} = await api.get('/auth/me');
    return data.data.user;
  },

  updateMe: async (payload: {
    name?: string;
    nickname?: string;
    studentId?: string | null;
    department?: string | null;
    profileImage?: string | null;
  }): Promise<UserProfile> => {
    const {data} = await api.patch<ApiResponse<{user: UserProfile}>>(
      '/auth/me',
      payload,
    );

    return data.data.user;
  },

  uploadProfileImage: async (payload: {
    base64: string;
    mimeType: string;
  }): Promise<{imageUrl: string}> => {
    const {data} = await api.post<ApiResponse<{imageUrl: string}>>(
      '/auth/me/profile-image',
      payload,
    );

    return data.data;
  },

  // 로그아웃
  logout: async () => {
    await api.post('/auth/logout');

    await tokenStorage.clearTokens();
  },

  deleteMe: async () => {
    await api.delete('/auth/me');
  },

  // 토큰 갱신
  refresh: async (refreshToken: string) => {
    const {data} = await api.post('/auth/refresh', {refreshToken});
    return data.data;
  },
};

export default api;
