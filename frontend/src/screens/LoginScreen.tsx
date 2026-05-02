import React from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {styles} from '../styles/commonStyles';
import {Input} from '../components/Input';
import {
  PrimaryButton,
  OutlineButton,
  SocialButton,
} from '../components/Buttons';

export function LoginScreen() {
  const navigation = useNavigation<any>();

  return (
    <ScrollView contentContainerStyle={styles.centerPage}>
      <View style={styles.card}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>LOGO</Text>
        </View>

        <Text style={styles.title}>로그인</Text>
        <Text style={styles.subtitle}>서비스를 이용하기 위해 로그인해주세요.</Text>

        <Input label="이메일" placeholder="이메일을 입력하세요" />
        <Input label="비밀번호" placeholder="비밀번호를 입력하세요" secure />

        <View style={styles.rowBetween}>
          <Text style={styles.smallText}>☐ 아이디 저장</Text>
          <Text style={styles.linkText}>비밀번호 찾기</Text>
        </View>

        <PrimaryButton
          title="로그인"
          onPress={() => navigation.replace('MainTabs')}
        />

        <OutlineButton
          title="게스트로 둘러보기"
          onPress={() => navigation.replace('MainTabs')}
        />

        <Text style={styles.dividerText}>또는</Text>

        <SocialButton title="카카오로 시작하기" />
        <SocialButton title="네이버로 시작하기" />
        <SocialButton title="구글로 시작하기" />

        <View style={styles.bottomTextRow}>
          <Text>계정이 없으신가요? </Text>
          <Pressable onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.linkText}>회원가입</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}