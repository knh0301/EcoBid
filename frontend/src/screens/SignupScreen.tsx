import React from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {styles} from '../styles/commonStyles';
import {GoToScreen} from '../types/navigation';
import {Input} from '../components/Input';
import {
  PrimaryButton,
  SocialButton,
} from '../components/Buttons';

export function SignupScreen({go}: {go: GoToScreen}) {
  return (
    <ScrollView contentContainerStyle={styles.centerPage}>
      <View style={styles.card}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>LOGO</Text>
        </View>

        <Text style={styles.title}>회원가입</Text>
        <Text style={styles.subtitle}>새로운 계정을 생성하세요.</Text>

        <Input label="이름" placeholder="이름을 입력하세요" />
        <Input label="이메일" placeholder="이메일을 입력하세요" />
        <Input label="비밀번호" placeholder="비밀번호를 생성하세요" secure />
        <Input label="비밀번호 확인" placeholder="비밀번호를 다시 입력하세요" secure />

        <PrimaryButton title="가입하기" onPress={() => go('home')} />

        <Text style={styles.dividerText}>또는</Text>

        <SocialButton title="카카오로 가입하기" />
        <SocialButton title="네이버로 가입하기" />
        <SocialButton title="구글로 가입하기" />

        <View style={styles.bottomTextRow}>
          <Text>이미 계정이 있으신가요? </Text>
          <Pressable onPress={() => go('login')}>
            <Text style={styles.linkText}>로그인</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}