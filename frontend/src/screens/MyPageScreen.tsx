import React from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {styles} from '../styles/commonStyles';
import {AppLayout} from '../components/AppLayout';
import {MissionItem} from '../components/MissionItem';

export function MyPageScreen() {
  const navigation = useNavigation<any>();

  return (
    <AppLayout>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.bgTitle}>내 정보</Text>

        <View style={styles.profileCard}>
          <View style={styles.largeAvatar} />
          <Text style={styles.title}>김나현</Text>
          <Text style={styles.subtitle}>레벨 5 · 2026년 4월 8일부터 활동중</Text>

          <View style={styles.addressBox}>
            <Text style={styles.sectionTitle}>📍 나의 동네 설정</Text>
            <Text style={styles.desc}>주소가 여기에 표시됩니다.</Text>
          </View>
        </View>

        <View style={styles.statRow}>
          <Pressable
            style={styles.statCard}
            onPress={() => navigation.navigate('LikedItems')}>
            <Text style={styles.statIcon}>❤️</Text>
            <Text style={styles.statNum}>0</Text>
            <Text>마음에 들어요</Text>
          </Pressable>

          <Pressable
            style={styles.statCard}
            onPress={() => navigation.navigate('CreditHistory')}>
            <Text style={styles.statIcon}>💰</Text>
            <Text style={styles.statNum}>1,250</Text>
            <Text>크레딧</Text>
          </Pressable>

          <Pressable
            style={styles.statCard}
            onPress={() => navigation.navigate('SharedItems')}>
            <Text style={styles.statIcon}>📦</Text>
            <Text style={styles.statNum}>3</Text>
            <Text>나눔한 물품</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionHeader}>나의 배지</Text>
        <View style={styles.badgeGrid}>
          {['🌱', '♻️', '🚲', '🥤', '🛍️', '🔒', '🔒', '🔒', '🔒'].map(
            (badge, index) => (
              <Text key={index} style={styles.badge}>
                {badge}
              </Text>
            ),
          )}
        </View>

        <Text style={styles.sectionHeader}>최근 활동</Text>
        <MissionItem title="미션 완료: 텀블러 사용 인증" credit="+100 크레딧" />
        <MissionItem title="물품 구매: 흰색 블라우스" credit="-5,000 크레딧" />
      </ScrollView>
    </AppLayout>
  );
}