import React, {useCallback, useMemo, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {getProductImageUrls, productsApi, Product} from '../api/products';
import {favoritesApi} from '../api/favorites';
import {creditsApi} from '../api/creditsApi';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {sharedItemsStyles as styles} from '../styles/SharedItemsScreenStyle';
import {ItemCard} from '../components/ItemCard';
import {CategoryFilter} from '../components/CategoryFilter';
import {FavoriteToast} from '../components/FavoriteToast';
import {useFavoriteToast} from '../hooks/useFavoriteToast';

const CATEGORIES = [
  '전체',
  '가구',
  '가전',
  '도서',
  '의류/잡화',
  '생활용품',
  '기타',
];

export function SharedItemsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [creditBalance, setCreditBalance] = useState(0);
  const [creditLoading, setCreditLoading] = useState(true);

  const [likedIds, setLikedIds] = useState<number[]>([]);
  const {toast, showFavoriteToast} = useFavoriteToast();

  const fetchProducts = async () => {
    setIsLoading(true);
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
      console.warn('Fetch shared items error:', err);
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

  useFocusEffect(useCallback(() => {
    fetchProducts();
    fetchCreditBalance();
  }, []));

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return products.filter(product => {
      const matchesCategory =
        selectedCategory === '전체' || product.category === selectedCategory;

      if (!matchesCategory) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return [
        product.title,
        product.description,
        product.category,
        product.seller?.nickname,
        product.seller?.name,
      ]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(normalizedQuery));
    });
  }, [products, searchQuery, selectedCategory]);

  const toggleLike = async (product: Product) => {
    const id = product.id;
    const shouldLike = !likedIds.includes(id);

    setLikedIds(prev =>
      shouldLike ? [...prev, id] : prev.filter(i => i !== id),
    );

    try {
      await favoritesApi.setFavorite(id, shouldLike);
      showFavoriteToast(
        shouldLike
          ? `${product.title}을(를) 찜했습니다.`
          : `${product.title} 찜을 취소했습니다.`,
        shouldLike ? 'liked' : 'unliked',
      );
    } catch (err: any) {
      console.warn('Toggle favorite error:', err);

      setLikedIds(prev =>
        shouldLike ? prev.filter(i => i !== id) : [...prev, id],
      );

      Alert.alert('오류', '찜 상태를 변경하지 못했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <View style={styles.header}>
        <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Text style={styles.backArrow}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>나눔 물품</Text>

        <View style={styles.creditBadge}>
          <Text style={styles.creditBadgeText}>
            {creditLoading ? '...' : `${creditBalance.toLocaleString()} 크레딧`}
          </Text>
        </View>
      </View>

      <CategoryFilter
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <View style={styles.searchArea}>
        <TextInput
          style={styles.searchInput}
          placeholder="물품명, 설명, 판매자 검색"
          placeholderTextColor="#999999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          returnKeyType="search"
        />

        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.searchClearButton}
            onPress={() => setSearchQuery('')}
            activeOpacity={0.8}>
            <Text style={styles.searchClearText}>지우기</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#5C8B5A"
          style={styles.loadingIndicator}
        />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : filteredProducts.length === 0 ? (
        <Text style={styles.emptyText}>조건에 맞는 나눔 물품이 없습니다.</Text>
      ) : (
        <FlatList
          data={filteredProducts}
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
              <ItemCard
                title={item.title}
                price={`${item.creditPrice.toLocaleString()} 크레딧`}
                icon="📦"
                backgroundColor="#EAF2E9"
                imageUrl={getProductImageUrls(item)[0]}
                isLiked={isLiked}
                onPress={() =>
                  navigation.navigate('ProductDetail', {productId: item.id})
                }
                onHeartPress={() => toggleLike(item)}
              />
            );
          }}
        />
      )}

      <TouchableOpacity
        style={[styles.fab, {bottom: insets.bottom + 24}]}
        onPress={() => navigation.navigate('ProductRegister')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <FavoriteToast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
      />
    </View>
  );
}
