import React, {useCallback, useMemo, useState} from 'react';
import {Alert, Pressable, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {mySharedItemsStyles as styles} from '../styles/MySharedItemsScreenStyle';
import {creditsApi} from '../api/creditsApi';
import {
  productsApi,
  Product,
  getProductImageUrls,
} from '../api/products';
import {favoritesApi} from '../api/favorites';
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

export function MySharedItemsScreen() {
  const navigation = useNavigation<any>();

  const [selectedCategory, setSelectedCategory] = useState('전체');

  const [creditBalance, setCreditBalance] = useState(0);
  const [creditLoading, setCreditLoading] = useState(true);

  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [likedIds, setLikedIds] = useState<number[]>([]);
  const {toast, showFavoriteToast} = useFavoriteToast();

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

  const fetchMyProducts = async () => {
    try {
      setProductsLoading(true);

      const [products, favoriteIds] = await Promise.all([
        productsApi.getMyProducts(),
        favoritesApi.getFavoriteIds().catch(err => {
          console.warn('Fetch favorite ids error:', err);
          return [] as number[];
        }),
      ]);

      setMyProducts(products);
      setLikedIds(favoriteIds);
    } catch (err: any) {
      console.warn('Fetch my shared products error:', err);
      setMyProducts([]);
      setLikedIds([]);
    } finally {
      setProductsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCreditBalance();
      fetchMyProducts();
    }, []),
  );

  const filteredItems = useMemo(() => {
    if (selectedCategory === '전체') {
      return myProducts;
    }

    return myProducts.filter(item => item.category === selectedCategory);
  }, [selectedCategory, myProducts]);

  const toggleLike = async (product: Product) => {
    const id = product.id;
    const shouldLike = !likedIds.includes(id);

    setLikedIds(prev =>
      shouldLike ? [...prev, id] : prev.filter(itemId => itemId !== id),
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
        shouldLike ? prev.filter(itemId => itemId !== id) : [...prev, id],
      );

      Alert.alert('오류', '찜 상태를 변경하지 못했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={10}
          style={styles.backButton}>
          <Ionicons name="chevron-back" size={26} color="#222222" />
        </Pressable>

        <Text style={styles.headerTitle}>내가 나눔한 물품</Text>

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

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {productsLoading ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>내가 나눔한 물품을 불러오는 중...</Text>
          </View>
        ) : filteredItems.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>아직 나눔한 물품이 없습니다.</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredItems.map(item => {
              const imageUrl = getProductImageUrls(item)[0];
              const isLiked = likedIds.includes(item.id);

              return (
                <ItemCard
                  key={item.id}
                  title={item.title}
                  price={`${item.creditPrice.toLocaleString()} 크레딧`}
                  icon="📦"
                  backgroundColor="#EAF2E9"
                  imageUrl={imageUrl}
                  isLiked={isLiked}
                  onHeartPress={() => toggleLike(item)}
                  onPress={() =>
                    navigation.navigate('ProductDetail', {
                      productId: item.id,
                    })
                  }
                />
              );
            })}
          </View>
        )}
      </ScrollView>

      <FavoriteToast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
      />
    </SafeAreaView>
  );
}
