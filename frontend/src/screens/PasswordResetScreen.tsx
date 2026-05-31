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
import {authApi} from '../api/authApi';
import {passwordResetStyles as styles} from '../styles/PasswordResetScreenStyle';

export function PasswordResetScreen() {
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [hasRequestedCode, setHasRequestedCode] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const requestResetCode = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      Alert.alert('입력 확인', '이메일을 입력해주세요.');
      return;
    }

    try {
      setIsRequesting(true);
      const result = await authApi.requestPasswordReset({email: trimmedEmail});

      if (result.resetCode) {
        setCode(result.resetCode);
      }

      setHasRequestedCode(true);
      Alert.alert('코드 발급', '비밀번호 재설정 코드를 확인해주세요.');
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        '비밀번호 재설정 코드를 요청하지 못했습니다.';

      Alert.alert('요청 실패', message);
    } finally {
      setIsRequesting(false);
    }
  };

  const resetPassword = async () => {
    const trimmedEmail = email.trim();
    const trimmedCode = code.trim();

    if (!trimmedEmail) {
      Alert.alert('입력 확인', '이메일을 입력해주세요.');
      return;
    }

    if (!trimmedCode) {
      Alert.alert('입력 확인', '재설정 코드를 입력해주세요.');
      return;
    }

    if (!password) {
      Alert.alert('입력 확인', '새 비밀번호를 입력해주세요.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('입력 확인', '비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    if (password !== passwordCheck) {
      Alert.alert('입력 확인', '새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      setIsResetting(true);
      await authApi.resetPassword({
        email: trimmedEmail,
        code: trimmedCode,
        password,
      });

      Alert.alert('변경 완료', '새 비밀번호로 로그인해주세요.', [
        {
          text: '확인',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        '비밀번호를 변경하지 못했습니다.';

      Alert.alert('변경 실패', message);
    } finally {
      setIsResetting(false);
    }
  };

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
              <Ionicons name="key-outline" size={40} color="#7FA56F" />
            </View>

            <Text style={styles.title}>비밀번호 찾기</Text>

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
                editable={!isRequesting && !isResetting}
              />
            </View>

            {!hasRequestedCode ? (
              <Pressable
                style={[styles.primaryButton, isRequesting && styles.disabledButton]}
                onPress={requestResetCode}
                disabled={isRequesting}>
                {isRequesting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>재설정 코드 받기</Text>
                )}
              </Pressable>
            ) : (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>재설정 코드</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="코드를 입력하세요"
                    placeholderTextColor="#999999"
                    value={code}
                    onChangeText={setCode}
                    keyboardType="number-pad"
                    editable={!isResetting}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>새 비밀번호</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="8자 이상"
                    placeholderTextColor="#999999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    editable={!isResetting}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>새 비밀번호 확인</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="새 비밀번호를 다시 입력하세요"
                    placeholderTextColor="#999999"
                    value={passwordCheck}
                    onChangeText={setPasswordCheck}
                    secureTextEntry
                    editable={!isResetting}
                  />
                </View>

                <Pressable
                  style={[styles.primaryButton, isResetting && styles.disabledButton]}
                  onPress={resetPassword}
                  disabled={isResetting}>
                  {isResetting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.primaryButtonText}>비밀번호 변경</Text>
                  )}
                </Pressable>

                <Pressable
                  style={styles.secondaryButton}
                  onPress={requestResetCode}
                  disabled={isRequesting || isResetting}>
                  <Text style={styles.secondaryButtonText}>코드 다시 받기</Text>
                </Pressable>
              </>
            )}

            <Pressable
              style={styles.loginLinkButton}
              onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLinkText}>로그인으로 돌아가기</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
