import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {productsApi, Product} from '../api/products';
import {creditsApi} from '../api/creditsApi';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface MissionCardProps {
  title: string;
  desc: string;
}

const MOCK_USER_ID = 3;

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

    console.log('MOCK_USER_ID:', MOCK_USER_ID);

    const balance = await creditsApi.getCreditBalance(MOCK_USER_ID);

    console.log('HomeScreen balance:', balance);

    setCreditBalance(balance);
  } catch (err: any) {
    console.warn('Fetch credit balance error:', err);
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

    await Promise.all([
      fetchProducts(false),
      fetchCreditBalance(),
    ]);

    setIsRefreshing(false);
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      {/* 상단 타이틀 */}
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
        {/* 출석 도장 카드 */}
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

        {/* 크레딧 잔액 카드 */}
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

        {/* 학과 순위 카드 */}
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

        {/* 나눔 물품 등록 배너 */}
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

        {/* 추천 미션 */}
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

        {/* 나눔 물품 리스트 */}
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
            style={{marginTop: 20}}
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
              <TouchableOpacity
                key={item.id}
                style={styles.productCard}
                onPress={() =>
                  navigation.navigate('ProductDetail', {productId: item.id})
                }
                activeOpacity={0.8}>
                <View
                  style={[
                    styles.productImage,
                    {backgroundColor: '#EAF2E9'},
                  ]}>
                  {item.imageUrl ? (
                    <Text style={styles.productImageText}>이미지 있음</Text>
                  ) : (
                    <Text style={styles.productImageText}>{item.title}</Text>
                  )}
                </View>

                <View style={styles.productBottom}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {item.title}
                  </Text>

                  <Text style={{fontSize: 18, color: '#CCCCCC'}}>♡</Text>
                </View>

                <Text style={styles.productPrice}>
                  {item.creditPrice.toLocaleString()} 크레딧
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },

  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },

  cardSubText: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 12,
    lineHeight: 18,
  },

  attendanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  attendanceLeft: {
    flex: 1,
    paddingRight: 12,
  },

  stampButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#5C8B5A',
    justifyContent: 'center',
    alignItems: 'center',
  },

  stampText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },

  creditTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  creditAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  creditAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5C8B5A',
  },

  creditUnit: {
    fontSize: 14,
    color: '#1A1A1A',
  },

  primaryButton: {
    backgroundColor: '#5C8B5A',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  outlineButton: {
    borderWidth: 1,
    borderColor: '#5C8B5A',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },

  outlineButtonText: {
    color: '#5C8B5A',
    fontSize: 15,
    fontWeight: '600',
  },

  rankList: {
    marginTop: 12,
  },

  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF8EC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 6,
  },

  rankItemFirst: {
    backgroundColor: '#EDE0C4',
  },

  rankNumber: {
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 12,
    color: '#1A1A1A',
    width: 16,
  },

  rankDept: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
  },

  rankCredit: {
    fontSize: 12,
    color: '#888888',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
  },

  seeAll: {
    fontSize: 13,
    color: '#888888',
    marginBottom: 12,
  },

  missionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },

  missionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },

  missionTitle: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#1A1A1A',
    marginBottom: 6,
  },

  missionDesc: {
    fontSize: 11,
    color: '#888888',
    marginBottom: 8,
    lineHeight: 16,
  },

  missionCredit: {
    fontSize: 11,
    color: '#5C8B5A',
    fontWeight: 'bold',
    marginBottom: 8,
  },

  missionButton: {
    backgroundColor: '#5C8B5A',
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
  },

  missionButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
  },

  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  productCard: {
    width: '47%',
  },

  productImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: 'flex-end',
    padding: 8,
  },

  productImageText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },

  productBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  productName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#1A1A1A',
    flex: 1,
  },

  productPrice: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },

  errorText: {
    color: '#FF5252',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },

  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    color: '#888888',
    fontSize: 14,
  },
});