import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Axios 인스턴스 생성
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const api = axios.create({
  baseURL: 'http://10.0.2.2:3000/api', // 안드로이드 에뮬레이터
  // baseURL: 'http://localhost:3000/api', // iOS 시뮬레이터
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 요청 인터셉터 (토큰 자동 첨부)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
api.interceptors.request.use(async (config) => {
  const accessToken = await SecureStore.getItemAsync('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 응답 인터셉터 (토큰 만료 시 자동 갱신)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 재시도 아닌 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        // 토큰 갱신 요청
        const { data } = await axios.post(
          'http://10.0.2.2:3000/api/auth/refresh',
          { refreshToken }
        );

        const newAccessToken = data.data.accessToken;
        const newRefreshToken = data.data.refreshToken;

        // 새 토큰 저장
        await SecureStore.setItemAsync('accessToken', newAccessToken);
        await SecureStore.setItemAsync('refreshToken', newRefreshToken);

        // 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch {
        // 갱신 실패 → 토큰 삭제
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Auth API 함수들
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const authApi = {
  // 구글 로그인
  googleLogin: async (idToken: string) => {
    const { data } = await api.post('/auth/google', { idToken });
    return data.data; // { user, accessToken, refreshToken }
  },

  // 내 정보 조회
  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data.data.user;
  },

  // 로그아웃
  logout: async () => {
    await api.post('/auth/logout');
  },

  // 토큰 갱신
  refresh: async (refreshToken: string) => {
    const { data } = await api.post('/auth/refresh', { refreshToken });
    return data.data; // { accessToken, refreshToken }
  },
};

export default api;