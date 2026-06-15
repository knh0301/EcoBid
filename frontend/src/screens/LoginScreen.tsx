import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from '../context/AuthContext';
import {loginStyles as styles} from '../styles/LoginScreenStyle';

export function LoginScreen() {
  const navigation = useNavigation<any>();
  const {
    loginWithEmail,
    signInWithGoogle,
    isLoading: authLoading,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('로그인 실패', '이메일을 입력해주세요.');
      return;
    }

    if (!password.trim()) {
      Alert.alert('로그인 실패', '비밀번호를 입력해주세요.');
      return;
    }

    try {
      setLoginLoading(true);
      await loginWithEmail(email.trim(), password);
    } catch (error: any) {
      console.warn('Login error:', error);

      const message =
        error.response?.data?.message ||
        '이메일 또는 비밀번호를 확인해주세요.';

      Alert.alert('로그인 실패', message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      Alert.alert('로그인 실패', error.message || '다시 시도해주세요.');
    }
  };


  const isButtonLoading = loginLoading || authLoading;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <View style={styles.logoBox}>
              <Ionicons name="leaf-outline" size={44} color="#7FA56F" />
            </View>

            <Text style={styles.title}>로그인</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>이메일</Text>
              <TextInput
                style={styles.input}
                placeholder="이메일을 입력하세요"
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
                placeholder="비밀번호를 입력하세요"
                placeholderTextColor="#999999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.findPasswordRow}>
              <Text style={styles.findPasswordText}>비밀번호를 잊으셨나요?</Text>
              <Pressable onPress={() => navigation.navigate('PasswordReset')}>
                <Text style={styles.findPasswordLink}> 비밀번호 찾기</Text>
              </Pressable>
            </View>

            <Pressable
              style={[styles.loginButton, loginLoading && {opacity: 0.7}]}
              onPress={handleLogin}
              disabled={isButtonLoading}>
              {loginLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>로그인</Text>
              )}
            </Pressable>

            <Text style={styles.dividerText}>또는</Text>

            <Pressable
              style={[styles.googleButton, authLoading && {opacity: 0.7}]}
              onPress={handleGoogleLogin}
              disabled={isButtonLoading}>
              {authLoading ? (
                <ActivityIndicator size="small" color="#4285F4" />
              ) : (
                <>
                  <Text style={styles.googleIcon}>G</Text>
                  <Text style={styles.googleButtonText}>Google로 로그인</Text>
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
