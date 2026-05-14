import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {productsApi, Product} from '../api/products';
import {creditsApi} from '../api/creditsApi';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {homeScreenStyles as styles} from '../styles/HomeScreenStyle';
import {ItemCard} from '../components/ItemCard';

interface MissionCardProps {
  title: string;
  desc: string;
}

const ranks = [
  {rank: '1', dept: '컴퓨터공학과', credit: '112,894 크레딧'},
  {rank: '2', dept: '디자인테크놀로지학과', credit: '112,894 크레딧'},
  {rank: '3', dept: '기계공학과', credit: '112,894 크레딧'},
];

const MissionCard: React.FC<MissionCardProps> = ({title, desc}) => (
  <View style={styles.missionCard}>
    <Text style={styles.missionTitle}>{title}</Text>
    <Text style={styles.missionDesc}>{desc}</Text>
    <Text style={styles.missionCredit}>+500 크레딧</Text>

    <TouchableOpacity style={styles.missionButton}>
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

  const [creditBalance, setCreditBalance] = useState(0);
  const [creditLoading, setCreditLoading] = useState(true);

  const fetchProducts = async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    }

    setError(null);

    try {
      const data = await productsApi.getProducts();
      setProducts(data);
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

  useEffect(() => {
    fetchProducts();
    fetchCreditBalance();
  }, []);

  const onRefresh = async () => {
    setIsRefreshing(true);

    await Promise.all([fetchProducts(false), fetchCreditBalance()]);

    setIsRefreshing(false);
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
          style={styles.card}
          onPress={() => navigation.navigate('Attendance')}
          activeOpacity={0.8}>
          <View style={styles.attendanceRow}>
            <View style={styles.attendanceLeft}>
              <Text style={styles.cardTitle}>오늘의 출석 도장</Text>
              <Text style={styles.cardSubText}>
                매일 출석하고 랜덤 크레딧을 받으세요!
              </Text>
            </View>

            <View style={styles.stampButton}>
              <Text style={styles.stampText}>STAMP</Text>
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
            onPress={() => navigation.navigate('MissionTab')}>
            <Text style={styles.primaryButtonText}>크레딧 모으기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>크레딧 총액 학과 순위</Text>

          <View style={styles.rankList}>
            {ranks.map(item => (
              <View
                key={item.rank}
                style={[
                  styles.rankItem,
                  item.rank === '1' && styles.rankItemFirst,
                ]}>
                <Text style={styles.rankNumber}>{item.rank}</Text>
                <Text style={styles.rankDept}>{item.dept}</Text>
                <Text style={styles.rankCredit}>{item.credit}</Text>
              </View>
            ))}
          </View>
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

        <View style={styles.missionRow}>
          <MissionCard
            title="텀블러 사용하기"
            desc="텀블러 사용을 인증하고 크레딧을 받으세요."
          />

          <MissionCard
            title="대중교통 이용하기"
            desc="대중교통 이용을 인증하고 크레딧을 받으세요."
          />
        </View>

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
                isLiked={false}
                onPress={() =>
                  navigation.navigate('ProductDetail', {productId: item.id})
                }
                onHeartPress={() => {
                  console.log('홈 나눔 물품 찜:', item.id);
                }}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};