import React from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {styles} from '../styles/commonStyles';
import {GoToScreen} from '../types/navigation';
import {AppLayout} from '../components/AppLayout';
import {MiniCard} from '../components/MiniCard';
import {OutlineButton} from '../components/Buttons';

export function HomeScreen({go}: {go: GoToScreen}) {
  return (
    <AppLayout active="home" go={go}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.appTitle}>EcoBid</Text>

        <Pressable style={styles.attendanceCard}>
          <View>
            <Text style={styles.sectionTitle}>오늘의 출석 도장</Text>
            <Text style={styles.desc}>매일 출석하고 랜덤 크레딧을 받으세요!</Text>
          </View>
          <View style={styles.stampButton}>
            <Text style={styles.stampText}>STAMP</Text>
          </View>
        </Pressable>

        <View style={styles.greenCard}>
          <Text style={styles.sectionTitle}>나의 크레딧 잔액</Text>
          <Text style={styles.creditText}>1,250 크레딧</Text>
          <OutlineButton title="크레딧 모으러 가기" onPress={() => go('mission')} />
        </View>

        <Pressable style={styles.cardBlock}>
          <Text style={styles.sectionTitle}>크레딧 총액 학과 순위</Text>
          <Text>1. 컴퓨터공학과 - 112,894 크레딧</Text>
          <Text>2. 디자인테크놀로지학과 - 108,420 크레딧</Text>
          <Text>3. 경영학과 - 98,150 크레딧</Text>
        </Pressable>

        <Text style={styles.sectionHeader}>추천 미션</Text>
        <View style={styles.horizontalRow}>
          <MiniCard title="텀블러 사용 인증" />
          <MiniCard title="분리수거 인증" />
          <MiniCard title="대중교통 이용" />
        </View>

        <Text style={styles.sectionHeader}>나눔 물품 리스트</Text>
        <View style={styles.grid}>
          {['빈티지 조명', '흰색 블라우스', '책상 스탠드', '머그컵'].map(item => (
            <Pressable
              key={item}
              style={styles.itemCard}
              onPress={() => go('productDetail')}>
              <View style={styles.itemImage} />
              <Text style={styles.itemTitle}>{item}</Text>
              <Text style={styles.itemPrice}>2500 크레딧</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </AppLayout>
  );
}