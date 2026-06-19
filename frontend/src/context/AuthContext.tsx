import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authApi, UserProfile} from '../api/authApi';
import {tokenStorage} from '../storage/tokenStorage';
import {disconnectChatSocket} from '../api/chatSocket';

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  userInfo: UserProfile | null;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

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
