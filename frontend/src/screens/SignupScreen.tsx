import React, {useState} from 'react';
import {
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
import {DepartmentSelectModal} from '../components/DepartmentSelectModal';
import {signupStyles as styles} from '../styles/SignupScreenStyle';

export function SignupScreen() {
  const navigation = useNavigation<any>();

  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departmentModalVisible, setDepartmentModalVisible] = useState(false);

  const showAlert = (message: string) => {
    Alert.alert('회원가입 실패', message);
  };

  const validateSignup = () => {
    if (!name.trim()) {
      showAlert('이름을 입력해주세요.');
      return false;
    }

    if (!nickname.trim()) {
      showAlert('닉네임을 입력해주세요.');
      return false;
    }

    if (!studentId.trim()) {
      showAlert('학번을 입력해주세요.');
      return false;
    }

    if (!department) {
      showAlert('학과를 선택해주세요.');
      return false;
    }

    if (!email.trim()) {
      showAlert('이메일을 입력해주세요.');
      return false;
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@inha\.edu$/;

    if (!emailRegex.test(email.trim())) {
      showAlert('이메일은 반드시 @inha.edu로 끝나야 합니다.');
      return false;
    }

    if (!password) {
      showAlert('비밀번호를 입력해주세요.');
      return false;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(password)) {
      showAlert('비밀번호는 영문과 숫자를 포함해 8자 이상이어야 합니다.');
      return false;
    }

    if (!passwordCheck) {
      showAlert('비밀번호 확인을 입력해주세요.');
      return false;
    }

    if (password !== passwordCheck) {
      showAlert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateSignup() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await authApi.register({
        email: email.trim(),
        password,
        name: name.trim(),
        nickname: nickname.trim(),
        studentId: studentId.trim(),
        department,
      });

      Alert.alert('회원가입 완료', '회원가입이 완료되었습니다. 로그인해주세요.', [
        {
          text: '확인',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.';

      showAlert(message);
    } finally {
      setIsSubmitting(false);
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
            <Text style={styles.title}>회원가입</Text>

            <View style={styles.profileArea}>
              <View style={styles.logoCircle}>
                <Ionicons name="leaf-outline" size={46} color="#7FA56F" />
              </View>

              <Pressable style={styles.cameraButton}>
                <Ionicons name="camera-outline" size={14} color="#666666" />
              </Pressable>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>이름</Text>
              <TextInput
                style={styles.input}
                placeholder="이름을 입력하세요"
                placeholderTextColor="#999999"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>닉네임</Text>
              <TextInput
                style={styles.input}
                placeholder="닉네임을 입력하세요"
                placeholderTextColor="#999999"
                value={nickname}
                onChangeText={setNickname}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>학번</Text>
              <TextInput
                style={styles.input}
                placeholder="학번을 입력하세요"
                placeholderTextColor="#999999"
                value={studentId}
                onChangeText={setStudentId}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>학과</Text>

              <Pressable
                style={styles.selectBox}
                onPress={() => setDepartmentModalVisible(true)}>
                <Text
                  style={[
                    styles.selectText,
                    !department && styles.placeholderText,
                  ]}>
                  {department || '학과'}
                </Text>

                <Ionicons name="chevron-down" size={18} color="#777777" />
              </Pressable>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>이메일</Text>
              <TextInput
                style={styles.input}
                placeholder="@inha.edu"
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
                placeholder="영문 + 숫자 포함 8자 이상"
                placeholderTextColor="#999999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>비밀번호 확인</Text>
              <TextInput
                style={styles.input}
                placeholder="비밀번호를 다시 입력하세요"
                placeholderTextColor="#999999"
                value={passwordCheck}
                onChangeText={setPasswordCheck}
                secureTextEntry
              />
            </View>

            <Pressable
              style={styles.signupButton}
              onPress={handleSignup}
              disabled={isSubmitting}>
              <Text style={styles.signupButtonText}>
                {isSubmitting ? '가입 중...' : '가입하기'}
              </Text>
            </Pressable>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>이미 계정이 있으신가요?</Text>

              <Pressable onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}> 로그인하기</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <DepartmentSelectModal
        visible={departmentModalVisible}
        selectedDepartment={department}
        onSelect={selectedDepartment => {
          setDepartment(selectedDepartment);
          setDepartmentModalVisible(false);
        }}
        onClose={() => setDepartmentModalVisible(false)}
      />
    </SafeAreaView>
  );
}
