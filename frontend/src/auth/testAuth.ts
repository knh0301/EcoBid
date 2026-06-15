import AsyncStorage from '@react-native-async-storage/async-storage';

export const TEST_AUTH_KEY = 'isTestAuthMode';

export const TEST_USER = {
  id: 0,
  email: 'tester@ecobid.local',
  name: '테스트 사용자',
  nickname: '테스트',
  department: '테스트학과',
  credits: 0,
  provider: 'LOCAL' as const,
};

export const isTestAuthEnabled = async () => {
  if (!__DEV__) {
    return false;
  }

  return (await AsyncStorage.getItem(TEST_AUTH_KEY)) === 'true';
};
