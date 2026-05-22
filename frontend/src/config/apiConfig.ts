import { Platform } from 'react-native';

const getBaseUrl = () => {
  // 1. 환경 변수가 설정되어 있으면 최우선으로 사용
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }

  // 2. 환경 변수가 없을 경우 개발 환경에서의 Fallback
  if (__DEV__) {
    return Platform.OS === 'android'
      ? 'http://10.0.2.2:3000/api'
      : 'http://localhost:3000/api';
  }

  // 3. 프로덕션 환경에서의 Fallback (안전장치)
  return 'https://api.ecobid.example.com/api';
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  TIMEOUT: 10000,
};