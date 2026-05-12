import React, {useState} from 'react';
import {
  Pressable,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Ionicons} from '@expo/vector-icons';
import {loginStyles as styles} from '../styles/LoginScreenStyle';
import { useAuth } from '../context/AuthContext';

export function LoginScreen() {
  const navigation = useNavigation<any>();
  const { signInWithGoogle, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // 지금은 백엔드 연동 전이므로 임시 토큰 저장
    // 나중에는 login API 응답으로 받은 accessToken을 저장하면 됨.
    await AsyncStorage.setItem('accessToken', 'mock-access-token');

    navigation.replace('MainTabs');
  };

const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      // 성공 시 RootNavigator가 자동으로 화면 전환
    } catch (error: any) {
      Alert.alert('로그인 실패', error.message || '다시 시도해주세요.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.card}>
          <View style={styles.logoBox}>
            <Ionicons name="leaf-outline" size={44} color="#7FA56F" />
          </View>

          <Text style={styles.title}>로그인</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>이메일</Text>
            <TextInput
              style={styles.input}
              placeholder="이메일을 입력하세요."
              placeholderTextColor="#999999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>비밀번호</Text>
            <TextInput
              style={styles.input}
              placeholder="비밀번호를 입력하세요."
              placeholderTextColor="#999999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.findPasswordRow}>
            <Text style={styles.findPasswordText}>비밀번호를 잊으셨나요?</Text>
            <Pressable>
              <Text style={styles.findPasswordLink}> 비밀번호 찾기</Text>
            </Pressable>
          </View>

          <Pressable style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>로그인</Text>
          </Pressable>

          <Text style={styles.dividerText}>또는</Text>

          <Pressable
            style={[styles.googleButton, isLoading && { opacity: 0.7 }]}
            onPress={handleGoogleLogin}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#4285F4" />
            ) : (
              <>
                <Text style={styles.googleIcon}>G</Text>
                <Text style={styles.googleButtonText}>Sign up with Google</Text>
              </>
            )}
          </Pressable>

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>계정이 없으신가요?</Text>
            <Pressable onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupLink}> 회원가입 하기</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}