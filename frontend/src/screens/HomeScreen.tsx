import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {getProductImageUrls, productsApi, Product} from '../api/products';
import {favoritesApi} from '../api/favorites';
import {creditsApi, DepartmentCreditRanking} from '../api/creditsApi';
import {missionsApi, RecommendedMission} from '../api/missions';
import {attendanceAPI} from '../api/attendanceService';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {homeScreenStyles as styles} from '../styles/HomeScreenStyle';
import {ItemCard} from '../components/ItemCard';
import {FavoriteToast} from '../components/FavoriteToast';
import {useFavoriteToast} from '../hooks/useFavoriteToast';

interface MissionCardProps {
  mission: RecommendedMission;
  onPress: () => void;
}

const MissionCard: React.FC<MissionCardProps> = ({mission, onPress}) => (
  <View style={styles.missionCard}>
    <Text style={styles.missionTitle}>{mission.title}</Text>
    <Text style={styles.missionDesc}>
      {mission.description || mission.desc}
    </Text>
    <Text style={styles.missionCredit}>
      +{mission.rewardPoints.toLocaleString()} 크레딧
    </Text>

    <TouchableOpacity
      style={styles.missionButton}
      onPress={onPress}
      activeOpacity={0.8}>
      <Text style={styles.missionButtonText}>인증하기</Text>
    </TouchableOpacity>
  </View>
);

export const HomeScreen: React.FC<any> = ({navigation}) => {
  const insets = useSafeAreaInsets();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<number[]>([]);

  const [creditBalance, setCreditBalance] = useState(0);
  const [creditLoading, setCreditLoading] = useState(true);
  const [departmentRanks, setDepartmentRanks] = useState<
    DepartmentCreditRanking[]
  >([]);
  const [rankLoading, setRankLoading] = useState(true);
  const [recommendedMissions, setRecommendedMissions] = useState<
    RecommendedMission[]
  >([]);
  const [missionLoading, setMissionLoading] = useState(true);
  const [isAttendedToday, setIsAttendedToday] = useState(false);
  const [todayAttendanceReward, setTodayAttendanceReward] = useState<
    number | null
  >(null);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const {toast, showFavoriteToast} = useFavoriteToast();

  const fetchProducts = async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    }

    setError(null);

    try {
      const [data, favoriteIds] = await Promise.all([
        productsApi.getProducts(),
        favoritesApi.getFavoriteIds().catch(err => {
          console.warn('Fetch favorite ids error:', err);
          return [] as number[];
        }),
      ]);

      setProducts(data);
      setLikedIds(favoriteIds);
    } catch (err: any) {
      console.warn('Fetch products error:', err);
      setError('상품을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCreditBalance = async () => {
    try {
      setCreditLoading(true);

      const balance = await creditsApi.getMyCreditBalance();

      setCreditBalance(balance);
    } catch (err: any) {
      console.warn('Fetch credit balance error:', err);
      setCreditBalance(0);
    } finally {
      setCreditLoading(false);
    }
  };

  const fetchDepartmentRankings = async () => {
    try {
      setRankLoading(true);

      const rankings = await creditsApi.getDepartmentCreditRankings(3);

      setDepartmentRanks(rankings);
    } catch (err: any) {
      console.warn('Fetch department rankings error:', err);
      setDepartmentRanks([]);
    } finally {
      setRankLoading(false);
    }
  };

  const fetchRecommendedMissions = async () => {
    try {
      setMissionLoading(true);

      const missions = await missionsApi.getRecommendedMissions(2);

      setRecommendedMissions(missions);
    } catch (err: any) {
      console.warn('Fetch recommended missions error:', err);
      setRecommendedMissions([]);
    } finally {
      setMissionLoading(false);
    }
  };

  const fetchAttendanceStatus = async () => {
    try {
      setAttendanceLoading(true);

      const status = await attendanceAPI.getTodayStatus();

      setIsAttendedToday(status.isAttended);
      setTodayAttendanceReward(status.attendance?.pointsEarned ?? null);
    } catch (err: any) {
      console.warn('Fetch attendance status error:', err);
      setIsAttendedToday(false);
      setTodayAttendanceReward(null);
    } finally {
      setAttendanceLoading(false);
    }
  };

  useFocusEffect(useCallback(() => {
    fetchProducts();
    fetchCreditBalance();
    fetchDepartmentRankings();
    fetchRecommendedMissions();
    fetchAttendanceStatus();
  }, []));

  const onRefresh = async () => {
    setIsRefreshing(true);

    await Promise.all([
      fetchProducts(false),
      fetchCreditBalance(),
      fetchDepartmentRankings(),
      fetchRecommendedMissions(),
      fetchAttendanceStatus(),
    ]);

    setIsRefreshing(false);
  };

  const toggleLike = async (product: Product) => {
    const productId = product.id;
    const shouldLike = !likedIds.includes(productId);

    setLikedIds(prev =>
      shouldLike ? [...prev, productId] : prev.filter(id => id !== productId),
    );

    try {
      await favoritesApi.setFavorite(productId, shouldLike);
      showFavoriteToast(
        shouldLike
          ? `${product.title}을(를) 찜했습니다.`
          : `${product.title} 찜을 취소했습니다.`,
        shouldLike ? 'liked' : 'unliked',
      );
    } catch (err: any) {
      console.warn('Toggle favorite error:', err);

      setLikedIds(prev =>
        shouldLike ? prev.filter(id => id !== productId) : [...prev, productId],
      );

      Alert.alert('오류', '찜 상태를 변경하지 못했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>EcoBid</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#5C8B5A"
          />
        }>
        <TouchableOpacity
          style={[
            styles.card,
            isAttendedToday && styles.attendanceDoneCard,
          ]}
          onPress={() => navigation.navigate('Attendance')}
          activeOpacity={0.8}>
          <View style={styles.attendanceRow}>
            <View style={styles.attendanceLeft}>
              <Text style={styles.cardTitle}>
                {isAttendedToday ? '오늘 출석 완료' : '오늘의 출석 도장'}
              </Text>
              <Text style={styles.cardSubText}>
                {isAttendedToday
                  ? '내일도 출석하고 새로운 크레딧 보상을 받아보세요!'
                  : '매일 출석하고 1~10 크레딧을 랜덤으로 받으세요!'}
              </Text>
            </View>

            <View
              style={[
                styles.stampButton,
                isAttendedToday && styles.stampButtonDone,
              ]}>
              <Text
                style={[
                  styles.stampText,
                  isAttendedToday && styles.stampRewardText,
                ]}>
                {attendanceLoading
                  ? '...'
                  : isAttendedToday
                    ? `+${todayAttendanceReward ?? 0}`
                    : 'STAMP'}
              </Text>
              {isAttendedToday && (
                <Text style={styles.stampSubText}>크레딧</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.card}>
          <View style={styles.creditTopRow}>
            <Text style={styles.cardTitle}>나의 크레딧 잔액</Text>

            <View style={styles.creditAmountRow}>
              <Text style={styles.creditAmount}>
                {creditLoading ? '...' : creditBalance.toLocaleString()}
              </Text>
              <Text style={styles.creditUnit}> 크레딧</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Mission')}>
            <Text style={styles.primaryButtonText}>크레딧 모으기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>크레딧 총액 학과 순위</Text>

          {rankLoading ? (
            <ActivityIndicator
              size="small"
              color="#5C8B5A"
              style={styles.inlineLoadingIndicator}
            />
          ) : departmentRanks.length === 0 ? (
            <Text style={styles.cardSubText}>아직 순위 데이터가 없습니다.</Text>
          ) : (
            <View style={styles.rankList}>
              {departmentRanks.map(item => (
                <View
                  key={`${item.rank}-${item.department}`}
                  style={[
                    styles.rankItem,
                    item.rank === 1 && styles.rankItemFirst,
                  ]}>
                  <Text style={styles.rankNumber}>{item.rank}</Text>
                  <Text style={styles.rankDept}>{item.department}</Text>
                  <Text style={styles.rankCredit}>
                    {item.totalCredits.toLocaleString()} 크레딧
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            나눔 물품을 등록하고 크레딧을 받아보세요!
          </Text>

          <Text style={styles.cardSubText}>
            물품 거래가 완료되면 1,000크레딧을 추가로 지급해드려요.
          </Text>

          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() => navigation.navigate('ProductRegister')}>
            <Text style={styles.outlineButtonText}>나눔 물품 등록하기</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>추천 미션</Text>

        {missionLoading ? (
          <ActivityIndicator
            size="small"
            color="#5C8B5A"
            style={styles.inlineLoadingIndicator}
          />
        ) : recommendedMissions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              오늘 추천 미션을 모두 완료했습니다.
            </Text>
          </View>
        ) : (
          <View style={styles.missionRow}>
            {recommendedMissions.map(mission => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onPress={() =>
                  navigation.navigate('MissionVerify', {
                    missionTitle: mission.title,
                    rewardPoints: mission.rewardPoints,
                  })
                }
              />
            ))}
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>나눔 물품 리스트</Text>

          <TouchableOpacity onPress={() => navigation.navigate('SharedItems')}>
            <Text style={styles.seeAll}>전체보기 {'>'}</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#5C8B5A"
            style={styles.loadingIndicator}
          />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : products.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>등록된 나눔 물품이 없습니다.</Text>
          </View>
        ) : (
          <View style={styles.productGrid}>
            {products.map(item => (
              <ItemCard
                key={item.id}
                title={item.title}
                price={`${item.creditPrice.toLocaleString()} 크레딧`}
                icon="📦"
                backgroundColor="#EAF2E9"
                imageUrl={getProductImageUrls(item)[0]}
                isLiked={likedIds.includes(item.id)}
                onPress={() =>
                  navigation.navigate('ProductDetail', {productId: item.id})
                }
                onHeartPress={() => toggleLike(item)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <FavoriteToast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
      />
    </View>
  );
};
