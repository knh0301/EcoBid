import React, {useCallback, useState} from 'react';
import {Modal, Pressable, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {myPageStyles as styles} from '../styles/MyPageScreenStyle';
import {creditsApi, CreditTransaction} from '../api/creditsApi';
import {authApi} from '../api/authApi';
import {favoritesApi} from '../api/favorites';
import {productsApi, Product} from '../api/products';
import {badgesApi, Badge} from '../api/badges';
import {colors} from '../styles/colors';

type BadgeItem = {
  code: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  desc: string;
  color: string;
  bgColor: string;
  isAwarded: boolean;
};

const BADGES: BadgeItem[] = [
  {
    code: 'COMMUNICATOR',
    icon: 'chatbubble-ellipses-outline',
    title: '소통왕',
    desc: '채팅방 20개',
    color: '#3F6FA8',
    bgColor: '#EAF2FF',
    isAwarded: false,
  },
  {
    code: 'GOLDEN_HAND',
    icon: 'hammer-outline',
    title: '금손',
    desc: '찜 합산 50회',
    color: '#7A5CDB',
    bgColor: '#F1EDFF',
    isAwarded: false,
  },
  {
    code: 'SAVER',
    icon: 'wallet-outline',
    title: '절약왕',
    desc: '5,000 크레딧',
    color: '#B88700',
    bgColor: '#FFF8D8',
    isAwarded: false,
  },
  {
    code: 'MISSION_RUNNER',
    icon: 'flag-outline',
    title: '미션러너',
    desc: '오늘 미션 4개',
    color: '#2F6F3E',
    bgColor: '#EAF2E9',
    isAwarded: false,
  },
  {
    code: 'SHARE_ANGEL',
    icon: 'gift-outline',
    title: '나눔 천사',
    desc: '이번 달 나눔 10회',
    color: '#2F6F3E',
    bgColor: '#EAF2E9',
    isAwarded: false,
  },
  {
    code: 'EARTH_GUARDIAN',
    icon: 'leaf-outline',
    title: '지구 수호',
    desc: '이번 달 미션 50회',
    color: '#4F8A45',
    bgColor: '#EEF7EA',
    isAwarded: false,
  },
  {
    code: 'PUBLIC_TRANSPORT',
    icon: 'bus-outline',
    title: '대중교통',
    desc: '이번 달 대중교통 10회',
    color: '#D9822B',
    bgColor: '#FFF3E4',
    isAwarded: false,
  },
  {
    code: 'PERFECT_ATTENDANCE',
    icon: 'calendar-clear-outline',
    title: '개근상',
    desc: '이번 달 출석 30회',
    color: '#D55353',
    bgColor: '#FFECEC',
    isAwarded: false,
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
  const [badges, setBadges] = useState<BadgeItem[]>(BADGES);
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);

  const levelInfo = getLevelInfo(totalEarnedCredits);
  const awardedBadgeCount = badges.filter(badge => badge.isAwarded).length;

  const fetchMyPageData = async () => {
    try {
      setCreditLoading(true);

      const user = await authApi.getMe();

      setUserName(user.name);

      const joinedDate = user.createdAt || user.created_at;

      if (joinedDate) {
        setJoinedDateText(formatJoinedDate(joinedDate));
      }

      const [transactions, favoriteIds, myProducts, fetchedBadges] =
        await Promise.all([
        creditsApi.getCreditTransactions(user.id),

        favoritesApi.getFavoriteIds().catch(err => {
          console.warn('Fetch favorite count error:', err);
          return [] as number[];
        }),

        productsApi.getMyProducts().catch(err => {
          console.warn('Fetch my product count error:', err);
          return [] as Product[];
        }),

        badgesApi.getMyBadges().catch(err => {
          console.warn('Fetch badges error:', err);
          return [] as Badge[];
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
      setBadges(mapBadges(fetchedBadges));
    } catch (err: any) {
      console.warn('Fetch mypage data error:', err);

      setUserName('이름 확인 중');
      setJoinedDateText('활동 시작일 확인 중');
      setCreditBalance(0);
      setTotalEarnedCredits(0);
      setActivities([]);
      setFavoriteCount(0);
      setMyProductCount(0);
      setBadges(BADGES);
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
              <Text style={styles.badgeCountText}>
                {awardedBadgeCount}/{badges.length}개
              </Text>
            </View>
          </View>

          <View style={styles.badgeGrid}>
            {badges.map(badge => (
              <Pressable
                key={badge.code}
                style={[
                  styles.badgeItem,
                  !badge.isAwarded && styles.badgeItemLocked,
                ]}
                onPress={() => setSelectedBadge(badge)}>
                <View
                  style={[
                    styles.badgeIconCircle,
                    {
                      backgroundColor: badge.isAwarded
                        ? badge.bgColor
                        : colors.gray200,
                    },
                  ]}>
                  <Ionicons
                    name={badge.isAwarded ? badge.icon : 'lock-closed-outline'}
                    size={24}
                    color={badge.isAwarded ? badge.color : colors.textMuted}
                  />
                </View>

                <Text
                  style={[
                    styles.badgeTitle,
                    !badge.isAwarded && styles.badgeTitleLocked,
                  ]}
                  numberOfLines={1}>
                  {badge.title}
                </Text>
              </Pressable>
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

      <Modal
        transparent
        visible={!!selectedBadge}
        animationType="fade"
        onRequestClose={() => setSelectedBadge(null)}>
        <Pressable
          style={styles.badgeModalOverlay}
          onPress={() => setSelectedBadge(null)}>
          <Pressable style={styles.badgeModalContent}>
            {selectedBadge ? (
              <>
                <View
                  style={[
                    styles.badgeModalIconCircle,
                    {
                      backgroundColor: selectedBadge.isAwarded
                        ? selectedBadge.bgColor
                        : colors.gray200,
                    },
                  ]}>
                  <Ionicons
                    name={
                      selectedBadge.isAwarded
                        ? selectedBadge.icon
                        : 'lock-closed-outline'
                    }
                    size={28}
                    color={
                      selectedBadge.isAwarded
                        ? selectedBadge.color
                        : colors.textMuted
                    }
                  />
                </View>

                <Text style={styles.badgeModalTitle}>
                  {selectedBadge.title}
                </Text>

                <Text style={styles.badgeModalDesc}>
                  {selectedBadge.desc}
                </Text>

                <Text
                  style={[
                    styles.badgeModalStatus,
                    selectedBadge.isAwarded
                      ? styles.badgeModalStatusAwarded
                      : styles.badgeModalStatusLocked,
                  ]}>
                  {selectedBadge.isAwarded ? '획득 완료' : '조건 미달성'}
                </Text>

                <Pressable
                  style={styles.badgeModalButton}
                  onPress={() => setSelectedBadge(null)}>
                  <Text style={styles.badgeModalButtonText}>확인</Text>
                </Pressable>
              </>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
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

function mapBadges(fetchedBadges: Badge[]) {
  if (fetchedBadges.length === 0) {
    return BADGES;
  }

  const fetchedByCode = new Map(
    fetchedBadges.map(badge => [badge.code, badge]),
  );

  return BADGES.map(badge => {
    const fetchedBadge = fetchedByCode.get(badge.code);

    if (!fetchedBadge) {
      return badge;
    }

    return {
      ...badge,
      title: fetchedBadge.title,
      desc: fetchedBadge.description,
      color: fetchedBadge.color,
      bgColor: fetchedBadge.bgColor,
      icon: fetchedBadge.icon as BadgeItem['icon'],
      isAwarded: fetchedBadge.isAwarded,
    };
  });
}
