import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {productsApi, Product} from '../api/products';
import {creditsApi} from '../api/creditsApi';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const CATEGORIES = ['전체', '가구', '가전', '도서', '의류/잡화', '생활용품', '기타'];

// 로그인 연동 전 임시 사용자 ID
// 나중에 로그인/JWT 연동 후 실제 로그인한 userId로 교체하면 됨
const MOCK_USER_ID = 3;

export function SharedItemsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const [selectedCategory, setSelectedCategory] = useState('전체');

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [creditBalance, setCreditBalance] = useState(0);
  const [creditLoading, setCreditLoading] = useState(true);

  const [likedIds, setLikedIds] = useState<number[]>([]);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await productsApi.getProducts();
      setProducts(data);
    } catch (err: any) {
      console.warn('Fetch shared items error:', err);
      setError('상품을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCreditBalance = async () => {
    try {
      setCreditLoading(true);

      const balance = await creditsApi.getCreditBalance(MOCK_USER_ID);

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

  const toggleLike = (id: number) => {
    setLikedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    );
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>나눔 물품</Text>

        <View style={styles.creditBadge}>
          <Text style={styles.creditBadgeText}>
            {creditLoading ? '...' : `${creditBalance.toLocaleString()} 크레딧`}
          </Text>
        </View>
      </View>

      {/* 카테고리 필터 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}>
        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat;

          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                isSelected && styles.categoryChipSelected,
              ]}
              onPress={() => setSelectedCategory(cat)}>
              <Text
                style={[
                  styles.categoryChipText,
                  isSelected && styles.categoryChipTextSelected,
                ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 상품 그리드 */}
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#5C8B5A"
          style={{marginTop: 40}}
        />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : products.length === 0 ? (
        <Text style={styles.emptyText}>등록된 나눔 물품이 없습니다.</Text>
      ) : (
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={[
            styles.grid,
            {paddingBottom: insets.bottom + 80},
          ]}
          columnWrapperStyle={styles.gridRow}
          renderItem={({item}) => {
            const isLiked = likedIds.includes(item.id);

            return (
              <TouchableOpacity
                style={styles.productCard}
                onPress={() =>
                  navigation.navigate('ProductDetail', {productId: item.id})
                }>
                <View style={styles.productImage}>
                  <Text style={styles.productImageText}>IMAGE</Text>
                </View>

                <View style={styles.productBottom}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {item.title}
                  </Text>

                  <TouchableOpacity onPress={() => toggleLike(item.id)}>
                    <Text
                      style={[
                        styles.heartIcon,
                        isLiked && styles.heartIconActive,
                      ]}>
                      {isLiked ? '♥' : '♡'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.productPrice}>
                  {item.creditPrice.toLocaleString()} 크레딧
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* 등록 FAB */}
      <TouchableOpacity
        style={[styles.fab, {bottom: insets.bottom + 24}]}
        onPress={() => navigation.navigate('ProductRegister')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#F5F5F5',
  },

  backArrow: {
    fontSize: 18,
    color: '#1A1A1A',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },

  creditBadge: {
    backgroundColor: '#EAF2E9',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },

  creditBadgeText: {
    color: '#5C8B5A',
    fontSize: 12,
    fontWeight: 'bold',
  },

  categoryScroll: {
    maxHeight: 52,
  },

  categoryContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: '#FFFFFF',
    marginRight: 8,
  },

  categoryChipSelected: {
    backgroundColor: '#5C8B5A',
    borderColor: '#5C8B5A',
  },

  categoryChipText: {
    fontSize: 13,
    color: '#1A1A1A',
  },

  categoryChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  grid: {
    padding: 16,
    paddingBottom: 80,
  },

  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  productCard: {
    width: '47%',
  },

  productImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#EAF2E9',
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  productImageText: {
    color: '#5C8B5A',
    fontWeight: 'bold',
  },

  productBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  productName: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#1A1A1A',
    marginRight: 6,
  },

  heartIcon: {
    fontSize: 18,
    color: '#888888',
  },

  heartIconActive: {
    color: '#5C8B5A',
  },

  productPrice: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },

  errorText: {
    textAlign: 'center',
    marginTop: 40,
    color: 'red',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#888888',
  },

  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#5C8B5A',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  fabText: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 32,
  },
});