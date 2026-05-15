import axios from 'axios';
import {API_CONFIG} from '../config/apiConfig';
import {tokenStorage} from '../storage/tokenStorage';

let refreshPromise: Promise<string> | null = null;

export async function refreshAuthTokens(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = await tokenStorage.getRefreshToken();

      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const {data} = await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, {
        refreshToken,
      });

      const newAccessToken = data.data.accessToken;
      const newRefreshToken = data.data.refreshToken;

      await tokenStorage.setAccessToken(newAccessToken);
      await tokenStorage.setRefreshToken(newRefreshToken);

      return newAccessToken;
    })().catch(async error => {
      await tokenStorage.clearTokens();
      throw error;
    }).finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}
