import React from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import { myPageStyles as styles } from '../styles/MyPageScreenStyle';

const BADGES = [
  {id: 1, emoji: '🛍️', title: '나눔 천사', desc: '물품을 나눈 따뜻한 마음'},
  {id: 2, emoji: '🌎', title: '지구수호대', desc: '친환경 활동 참여'},
  {id: 3, emoji: '💬', title: '수다쟁이', desc: '다양한 소통 참여'},
  {id: 4, emoji: '🚎', title: '탄소 발자국 지킴이', desc: '대중교통 이용'},
  {id: 5, emoji: '💰', title: '절약왕', desc: '크레딧 모으기'},
  {id: 6, emoji: '🛠️', title: '금손', desc: '물품 등록 참여'},
  {id: 7, emoji: '🏆', title: '개근상', desc: '출석 미션 수행'},
  {id: 8, emoji: '🎯', title: '미션러너', desc: '미션 꾸준히 완료'},
];

const ACTIVITIES = [
  {
    id: 1,
    title: '물품 구매 : 빈티지 조명',
    credit: '- 2,500 크레딧',
    type: 'minus',
  },
  {
    id: 2,
    title: '미션 완료 : 텀블러 사용하기',
    credit: '+ 500 크레딧',
    type: 'plus',
  },
  {
    id: 3,
    title: '미션 완료 : 매일 출석',
    credit: '+ 10 크레딧',
    type: 'plus',
  },
];

export function MyPageScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topHeader}>
        <Text style={styles.headerLogo}>EcoBid</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>내 정보</Text>

        <Pressable
  style={styles.profileCard}
  onPress={() => navigation.navigate('ProfileEdit')}>
  <View style={styles.profileImageOuter}>
    <View style={styles.profileImageInner}>
      <Text style={styles.profileEmoji}>🙂</Text>
    </View>
  </View>

  <Text style={styles.userName}>김나현</Text>
  <Text style={styles.userInfo}>레벨 5. 2026년 4월 8일부터 활동중</Text>

  <View style={styles.levelArea}>
    <Text style={styles.levelLabel}>레벨 6까지 남은 경험치</Text>

    <View style={styles.progressRow}>
      <View style={styles.progressTrack}>
        <View style={styles.progressFill} />
      </View>
      <Text style={styles.progressText}>17,500/250,000</Text>
    </View>
  </View>
</Pressable>

        <View style={styles.statRow}>
          <Pressable
            style={styles.statCard}
            onPress={() => navigation.navigate('LikedItems')}>
            <Ionicons name="heart" size={30} color="#D24D4D" />
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>찜</Text>
          </Pressable>

          <Pressable
            style={styles.statCard}
            onPress={() => navigation.navigate('CreditHistory')}>
            <Ionicons name="cash-outline" size={32} color="#F2A72C" />
            <Text style={styles.statNumber}>1,250</Text>
            <Text style={styles.statLabel}>크레딧</Text>
          </Pressable>

          <Pressable
            style={styles.statCard}
            onPress={() => navigation.navigate('MySharedItems')}>
            <Ionicons name="bag-handle-outline" size={32} color="#30406D" />
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>나눔한 물품</Text>
          </Pressable>
        </View>

        <View style={styles.badgeCard}>
          <Text style={styles.sectionTitle}>나의 배지</Text>

          <View style={styles.badgeGrid}>
            {BADGES.map(badge => (
              <View key={badge.id} style={styles.badgeItem}>
  <Text style={styles.badgeEmoji}>{badge.emoji}</Text>

  <Text style={styles.badgeTitle} numberOfLines={1}>
    {badge.title}
  </Text>

  <Text style={styles.badgeDesc} numberOfLines={2}>
    {badge.desc}
  </Text>
</View>
            ))}
          </View>
        </View>

        <Text style={styles.activityTitle}>최근 활동</Text>

        <View style={styles.activityList}>
          {ACTIVITIES.map(activity => (
            <View key={activity.id} style={styles.activityItem}>
              <Text style={styles.activityText}>{activity.title}</Text>
              <Text
                style={[
                  styles.activityCredit,
                  activity.type === 'minus'
                    ? styles.minusCredit
                    : styles.plusCredit,
                ]}>
                {activity.credit}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
