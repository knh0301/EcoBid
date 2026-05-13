import axios from 'axios';

// 1. 여기서 직접 axios 설정을 만듭니다 (따로 index 파일을 찾지 않음)
const api = axios.create({
  baseURL: 'http://10.0.2.2:3000/api', // 안드로이드 에뮬레이터에서 내 컴퓨터 서버로 접속하는 주소
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. 출석 관련 API 함수들
export const attendanceAPI = {
  // 오늘 출석하기 (POST /api/attendance/check)
  checkIn: async (userId: number) => {
    const response = await api.post('/attendance/check', { userId });
    return response.data;
  },

  // 오늘 출석 여부 확인 (GET /api/attendance/today/:userId)
  getTodayStatus: async (userId: number) => {
    const response = await api.get(`/attendance/today/${userId}`);
    return response.data;
  },

  // 출석 히스토리 가져오기 (GET /api/attendance/history/:userId)
  getHistory: async (userId: number) => {
    const response = await api.get(`/attendance/history/${userId}`);
    return response.data;
  },

  // 연속 출석일 조회 (GET /api/attendance/streak/:userId)
  getStreak: async (userId: number) => {
    const response = await api.get(`/attendance/streak/${userId}`);
    return response.data;
  }
};