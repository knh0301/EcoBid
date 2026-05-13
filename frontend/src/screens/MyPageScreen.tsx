import React, {useEffect, useState} from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {myPageStyles as styles} from '../styles/MyPageScreenStyle';
import {creditsApi, CreditTransaction} from '../api/creditsApi';

const MOCK_USER_ID = 3;

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

type ActivityItem = {
  id: number;
  title: string;
  credit: string;
  type: 'plus' | 'minus';
};

export function MyPageScreen() {
  const navigation = useNavigation<any>();

  const [creditBalance, setCreditBalance] = useState(0);
  const [creditLoading, setCreditLoading] = useState(true);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  const fetchCreditData = async () => {
    try {
      setCreditLoading(true);

      const transactions = await creditsApi.getCreditTransactions(MOCK_USER_ID);

      const balance = transactions.reduce((sum, item) => {
        return sum + Number(item.amount);
      }, 0);

      const recentActivities = transactions
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 3)
        .map(mapTransactionToActivity);

      setCreditBalance(balance);
      setActivities(recentActivities);
    } catch (err: any) {
      console.warn('Fetch mypage credit data error:', err);
    } finally {
      setCreditLoading(false);
    }
  };

  useEffect(() => {
    fetchCreditData();
  }, []);

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
          <Text style={styles.userInfo}>
            레벨 5. 2026년 4월 8일부터 활동중
          </Text>

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
            <Text style={styles.statNumber}>
              {creditLoading ? '...' : creditBalance.toLocaleString()}
            </Text>
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
          {creditLoading ? (
            <View style={styles.activityItem}>
              <Text style={styles.activityText}>최근 활동을 불러오는 중...</Text>
              <Text style={styles.activityCredit}>...</Text>
            </View>
          ) : activities.length === 0 ? (
            <View style={styles.activityItem}>
              <Text style={styles.activityText}>최근 활동이 없습니다.</Text>
              <Text style={styles.activityCredit}>0 크레딧</Text>
            </View>
          ) : (
            activities.map(activity => (
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
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function mapTransactionToActivity(
  transaction: CreditTransaction,
): ActivityItem {
  const amount = Number(transaction.amount);

  return {
    id: transaction.id,
    title: transaction.description || getDefaultActivityTitle(transaction.referenceType),
    credit: formatCredit(amount),
    type: amount > 0 ? 'plus' : 'minus',
  };
}

function getDefaultActivityTitle(referenceType: CreditTransaction['referenceType']) {
  switch (referenceType) {
    case 'ATTENDANCE':
      return '출석 보상';
    case 'MISSION':
      return '미션 완료';
    case 'PRODUCT':
      return '물품 거래';
    default:
      return '크레딧 활동';
  }
}

function formatCredit(amount: number) {
  const absAmount = Math.abs(amount).toLocaleString();

  if (amount > 0) {
    return `+ ${absAmount} 크레딧`;
  }

  return `- ${absAmount} 크레딧`;
}