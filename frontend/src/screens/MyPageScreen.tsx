import React, {useCallback, useState} from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {myPageStyles as styles} from '../styles/MyPageScreenStyle';
import {creditsApi, CreditTransaction} from '../api/creditsApi';
import {authApi} from '../api/authApi';
import {favoritesApi} from '../api/favorites';
import {productsApi, Product} from '../api/products';
import {colors} from '../styles/colors';

type BadgeItem = {
  id: number;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  desc: string;
  color: string;
  bgColor: string;
};

const BADGES: BadgeItem[] = [
  {
    id: 1,
    icon: 'gift-outline',
    title: '나눔 천사',
    desc: '첫 나눔 완료',
    color: '#2F6F3E',
    bgColor: '#EAF2E9',
  },
  {
    id: 2,
    icon: 'leaf-outline',
    title: '지구 수호',
    desc: '친환경 실천',
    color: '#4F8A45',
    bgColor: '#EEF7EA',
  },
  {
    id: 3,
    icon: 'chatbubble-ellipses-outline',
    title: '소통왕',
    desc: '채팅 참여',
    color: '#3F6FA8',
    bgColor: '#EAF2FF',
  },
  {
    id: 4,
    icon: 'bus-outline',
    title: '대중교통',
    desc: '탄소 절감',
    color: '#D9822B',
    bgColor: '#FFF3E4',
  },
  {
    id: 5,
    icon: 'wallet-outline',
    title: '절약왕',
    desc: '크레딧 모음',
    color: '#B88700',
    bgColor: '#FFF8D8',
  },
  {
    id: 6,
    icon: 'hammer-outline',
    title: '금손',
    desc: '물품 등록',
    color: '#7A5CDB',
    bgColor: '#F1EDFF',
  },
  {
    id: 7,
    icon: 'calendar-clear-outline',
    title: '개근상',
    desc: '출석 완료',
    color: '#D55353',
    bgColor: '#FFECEC',
  },
  {
    id: 8,
    icon: 'flag-outline',
    title: '미션러너',
    desc: '미션 참여',
    color: '#2F6F3E',
    bgColor: '#EAF2E9',
  },
];

type ActivityItem = {
  id: number;
  title: string;
  credit: string;
  type: 'plus' | 'minus';
};

export function MyPageScreen() {
  const navigation = useNavigation<any>();

  const [userName, setUserName] = useState('이름 확인 중');
  const [joinedDateText, setJoinedDateText] = useState('활동 시작일 확인 중');

  const [creditBalance, setCreditBalance] = useState(0);
  const [creditLoading, setCreditLoading] = useState(true);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [totalEarnedCredits, setTotalEarnedCredits] = useState(0);

  const [favoriteCount, setFavoriteCount] = useState(0);
  const [myProductCount, setMyProductCount] = useState(0);

  const levelInfo = getLevelInfo(totalEarnedCredits);

  const fetchMyPageData = async () => {
    try {
      setCreditLoading(true);

      const user = await authApi.getMe();

      setUserName(user.name);

      const joinedDate = user.createdAt || user.created_at;

      if (joinedDate) {
        setJoinedDateText(formatJoinedDate(joinedDate));
      }

      const [transactions, favoriteIds, myProducts] = await Promise.all([
        creditsApi.getCreditTransactions(user.id),

        favoritesApi.getFavoriteIds().catch(err => {
          console.warn('Fetch favorite count error:', err);
          return [] as number[];
        }),

        productsApi.getMyProducts().catch(err => {
          console.warn('Fetch my product count error:', err);
          return [] as Product[];
        }),
      ]);

      const balance = transactions.reduce((sum, item) => {
        return sum + Number(item.amount);
      }, 0);

      const earnedCredits = transactions
        .filter(item => Number(item.amount) > 0)
        .reduce((sum, item) => {
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
      setTotalEarnedCredits(earnedCredits);
      setActivities(recentActivities);
      setFavoriteCount(favoriteIds.length);
      setMyProductCount(myProducts.length);
    } catch (err: any) {
      console.warn('Fetch mypage data error:', err);

      setUserName('이름 확인 중');
      setJoinedDateText('활동 시작일 확인 중');
      setCreditBalance(0);
      setTotalEarnedCredits(0);
      setActivities([]);
      setFavoriteCount(0);
      setMyProductCount(0);
    } finally {
      setCreditLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMyPageData();
    }, []),
  );

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

          <Text style={styles.userName}>{userName}</Text>

          <Text style={styles.userInfo}>
            레벨 {levelInfo.level}. {joinedDateText}
          </Text>

          <View style={styles.levelArea}>
            <Text style={styles.levelLabel}>
              레벨 {levelInfo.level + 1}까지 남은 경험치
            </Text>

            <View style={styles.progressRow}>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {width: `${Math.min(levelInfo.progressPercent, 100)}%`},
                  ]}
                />
              </View>

              <Text style={styles.progressText}>
                {totalEarnedCredits.toLocaleString()}/
                {levelInfo.nextLevelCredit.toLocaleString()}
              </Text>
            </View>
          </View>
        </Pressable>

        <View style={styles.statRow}>
          <Pressable
            style={styles.statCard}
            onPress={() => navigation.navigate('LikedItems')}>
            <Ionicons name="heart" size={30} color={colors.heart} />
            <Text style={styles.statNumber}>{favoriteCount}</Text>
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

            <Text style={styles.statNumber}>
              {creditLoading ? '...' : myProductCount}
            </Text>

            <Text style={styles.statLabel}>나눔한 물품</Text>
          </Pressable>
        </View>

        <View style={styles.badgeCard}>
          <View style={styles.badgeHeaderRow}>
            <Text style={styles.sectionTitle}>나의 배지</Text>

            <View style={styles.badgeCountPill}>
              <Text style={styles.badgeCountText}>{BADGES.length}개</Text>
            </View>
          </View>

          <View style={styles.badgeGrid}>
            {BADGES.map(badge => (
              <View key={badge.id} style={styles.badgeItem}>
                <View
                  style={[
                    styles.badgeIconCircle,
                    {backgroundColor: badge.bgColor},
                  ]}>
                  <Ionicons name={badge.icon} size={24} color={badge.color} />
                </View>

                <Text style={styles.badgeTitle} numberOfLines={1}>
                  {badge.title}
                </Text>

                <Text style={styles.badgeDesc} numberOfLines={1}>
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
    title:
      transaction.description ||
      getDefaultActivityTitle(transaction.referenceType),
    credit: formatCredit(amount),
    type: amount > 0 ? 'plus' : 'minus',
  };
}

function getDefaultActivityTitle(
  referenceType: CreditTransaction['referenceType'],
) {
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

function getLevelInfo(totalEarnedCredits: number) {
  if (totalEarnedCredits < 5000) {
    return {
      level: 1,
      nextLevelCredit: 5000,
      progressPercent: (totalEarnedCredits / 5000) * 100,
    };
  }

  if (totalEarnedCredits < 10000) {
    return {
      level: 2,
      nextLevelCredit: 10000,
      progressPercent: ((totalEarnedCredits - 5000) / 5000) * 100,
    };
  }

  const levelAfterThree = Math.floor((totalEarnedCredits - 10000) / 10000);

  const level = 3 + levelAfterThree;
  const currentLevelStart = 10000 + levelAfterThree * 10000;
  const nextLevelCredit = currentLevelStart + 10000;

  return {
    level,
    nextLevelCredit,
    progressPercent:
      ((totalEarnedCredits - currentLevelStart) /
        (nextLevelCredit - currentLevelStart)) *
      100,
  };
}

function formatJoinedDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return '활동 시작일 확인 중';
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}년 ${month}월 ${day}일부터 활동중`;
}