import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (__DEV__) {
    // 개발 환경
    return Platform.OS === 'android'
      ? 'http://10.0.2.2:3000/api'    // Android 에뮬레이터
      : 'http://localhost:3000/api';   // iOS 시뮬레이터
  }
  // 프로덕션 환경
  return 'https://실제서버주소.com';
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  TIMEOUT: 10000,
};