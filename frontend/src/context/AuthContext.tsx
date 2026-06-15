import React, { createContext, useContext, useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert, Platform} from 'react-native';
import {authApi, UserProfile} from '../api/authApi';
import {tokenStorage} from '../storage/tokenStorage';
import {disconnectChatSocket} from '../api/chatSocket';

WebBrowser.maybeCompleteAuthSession();

const readEnv = (value?: string) => {
  const trimmedValue = value?.trim();

  return trimmedValue && !trimmedValue.startsWith('YOUR_')
    ? trimmedValue
    : undefined;
};

const GOOGLE_CLIENT_IDS = {
  webClientId: readEnv(process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID),
  androidClientId: readEnv(process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID),
  iosClientId: readEnv(process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID),
};
const GOOGLE_CLIENT_ID_FALLBACK =
  GOOGLE_CLIENT_IDS.webClientId ||
  GOOGLE_CLIENT_IDS.androidClientId ||
  GOOGLE_CLIENT_IDS.iosClientId ||
  'google-client-id-not-configured';

const getPlatformGoogleClientId = () =>
  Platform.select({
    android: GOOGLE_CLIENT_IDS.androidClientId,
    ios: GOOGLE_CLIENT_IDS.iosClientId,
    default: GOOGLE_CLIENT_IDS.webClientId,
  }) || '';

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  userInfo: UserProfile | null;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_CLIENT_ID_FALLBACK,
    webClientId: GOOGLE_CLIENT_IDS.webClientId,
    androidClientId: GOOGLE_CLIENT_IDS.androidClientId,
    iosClientId: GOOGLE_CLIENT_IDS.iosClientId,
    scopes: ['openid', 'profile', 'email'],
    selectAccount: true,
    language: 'ko',
  });

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const accessToken =
        response.authentication?.accessToken || response.params.access_token;
      const idToken =
        response.authentication?.idToken || response.params.id_token;

      handleGoogleToken({accessToken, idToken}).catch((error: any) => {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          'Google 로그인에 실패했습니다.';

        Alert.alert('로그인 실패', message);
      });
    } else if (response?.type === 'error') {
      Alert.alert(
        '로그인 실패',
        response.error?.message || 'Google 로그인에 실패했습니다.',
      );
    }
  }, [response]);

  const checkLoginStatus = async () => {
    try {
      const accessToken = await tokenStorage.getAccessToken();
      const refreshToken = await tokenStorage.getRefreshToken();

      if (!accessToken || !refreshToken) {
        await clearLocalAuthState();
        return;
      }

      const user = await authApi.getMe();

      await AsyncStorage.setItem('userInfo', JSON.stringify(user));
      setUserInfo(user);
      setIsLoggedIn(true);
    } catch (e) {
      console.error(e);
      await clearLocalAuthState();
    } finally {
      setIsLoading(false);
    }
  };


  const loginWithEmail = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      disconnectChatSocket();
      const result = await authApi.login({email, password});

      await AsyncStorage.setItem('userInfo', JSON.stringify(result.user));
      setUserInfo(result.user);
      setIsLoggedIn(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleToken = async ({
    accessToken,
    idToken,
  }: {
    accessToken?: string;
    idToken?: string;
  }) => {
    if (!accessToken && !idToken) {
      throw new Error('Google 인증 토큰을 받지 못했습니다.');
    }

    setIsLoading(true);

    try {
      disconnectChatSocket();
      const result = await authApi.googleLogin({accessToken, idToken});

      await AsyncStorage.setItem('userInfo', JSON.stringify(result.user));
      setUserInfo(result.user);
      setIsLoggedIn(true);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    if (!getPlatformGoogleClientId()) {
      throw new Error(
        Platform.select({
          android:
            'Android용 Google OAuth 클라이언트 ID를 EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID에 설정해주세요.',
          ios:
            'iOS용 Google OAuth 클라이언트 ID를 EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID에 설정해주세요.',
          default:
            'Web용 Google OAuth 클라이언트 ID를 EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID에 설정해주세요.',
        }) || 'Google OAuth 클라이언트 ID를 환경변수에 설정해주세요.',
      );
    }

    if (!request) {
      throw new Error('Google 로그인을 준비 중입니다.');
    }

    const result = await promptAsync();

    if (result.type === 'cancel' || result.type === 'dismiss') {
      throw new Error('Google 로그인이 취소되었습니다.');
    }

    if (result.type === 'error') {
      throw new Error(result.error?.message || 'Google 로그인에 실패했습니다.');
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.warn('Logout request error:', e);
    } finally {
      await clearLocalAuthState();
    }
  };

  const clearLocalAuthState = async () => {
    disconnectChatSocket();
    await tokenStorage.clearTokens();
    await AsyncStorage.removeItem('isTestAuthMode');
    await AsyncStorage.removeItem('userInfo');
    setUserInfo(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        userInfo,
        loginWithEmail,
        signInWithGoogle,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
