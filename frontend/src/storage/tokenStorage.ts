import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const tokenStorage = {
  /**
   * Access Token 저장
   */
  async setAccessToken(token: string): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.setItem(ACCESS_TOKEN_KEY, token),
        SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token),
      ]);
    } catch (e) {
      console.error('Error saving access token', e);
    }
  },

  /**
   * Access Token 조회
   */
  async getAccessToken(): Promise<string | null> {
    try {
      const secureToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      if (secureToken) {
        return secureToken;
      }

      return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    } catch (e) {
      console.error('Error getting access token', e);
      return null;
    }
  },

  /**
   * Refresh Token 저장
   */
  async setRefreshToken(token: string): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.setItem(REFRESH_TOKEN_KEY, token),
        SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token),
      ]);
    } catch (e) {
      console.error('Error saving refresh token', e);
    }
  },

  /**
   * Refresh Token 조회
   */
  async getRefreshToken(): Promise<string | null> {
    try {
      const secureToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      if (secureToken) {
        return secureToken;
      }

      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (e) {
      console.error('Error getting refresh token', e);
      return null;
    }
  },

  /**
   * 모든 토큰 삭제 (로그아웃 또는 401 에러 시 사용)
   */
  async clearTokens(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]),
        SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
      ]);
    } catch (e) {
      console.error('Error clearing tokens', e);
    }
  },
};
