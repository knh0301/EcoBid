import React, { createContext, useContext, useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authApi, UserProfile} from '../api/authApi';
import {tokenStorage} from '../storage/tokenStorage';
import {disconnectChatSocket} from '../api/chatSocket';

WebBrowser.maybeCompleteAuthSession();

const WEB_CLIENT_ID = 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com';
const ANDROID_CLIENT_ID = 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com';
const IOS_CLIENT_ID = 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com';

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
    webClientId: WEB_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
  });

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleGoogleToken(authentication?.accessToken);
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

  const handleGoogleToken = async (accessToken?: string) => {
    if (!accessToken) return;
    setIsLoading(true);

    try {
      const userInfoRes = await fetch(
        'https://www.googleapis.com/userinfo/v2/me',
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const googleUser = await userInfoRes.json();

      const result = await authApi.socialLogin({
        email: googleUser.email,
        name: googleUser.name,
        profileImage: googleUser.picture,
        provider: 'GOOGLE',
        providerId: googleUser.id,
      });

      await AsyncStorage.setItem('userInfo', JSON.stringify(result.user));
      disconnectChatSocket();
      
      setUserInfo(result.user);
      setIsLoggedIn(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    await promptAsync();
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
