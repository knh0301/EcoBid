import React, {useCallback, useMemo, useState} from 'react';
import {ActivityIndicator, Alert, Pressable, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {likedItemsStyles as styles} from '../styles/LikedItemsScreenStyle';
import {creditsApi} from '../api/creditsApi';
import {favoritesApi} from '../api/favorites';
import {getProductImageUrls, Product} from '../api/products';
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

export function LikedItemsScreen() {
  const navigation = useNavigation<any>();

  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [likedItems, setLikedItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creditBalance, setCreditBalance] = useState(0);
  const [creditLoading, setCreditLoading] = useState(true);
  const {toast, showFavoriteToast} = useFavoriteToast();

  const fetchLikedItems = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await favoritesApi.getFavorites();

      setLikedItems(data);
    } catch (err: any) {
      console.warn('Fetch liked items error:', err);
      setError('찜한 물품을 불러오는 중 오류가 발생했습니다.');
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
    fetchLikedItems();
    fetchCreditBalance();
  }, []));

  const filteredItems = useMemo(() => {
    if (selectedCategory === '전체') {
      return likedItems;
    }

    return likedItems.filter(item => {
      const category = (item as Product & {category?: string}).category;
      return category === selectedCategory;
    });
  }, [likedItems, selectedCategory]);

  const removeLike = async (product: Product) => {
    const productId = product.id;
    const previousItems = likedItems;

    setLikedItems(prev => prev.filter(item => item.id !== productId));

    try {
      await favoritesApi.removeFavorite(productId);
      showFavoriteToast(`${product.title} 찜을 취소했습니다.`, 'unliked');
    } catch (err: any) {
      console.warn('Remove favorite error:', err);
      setLikedItems(previousItems);
      Alert.alert('오류', '찜을 해제하지 못했습니다. 다시 시도해주세요.');
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

        <Text style={styles.headerTitle}>내가 찜한 물품</Text>

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
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#5C8B5A"
            style={styles.loadingIndicator}
          />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : filteredItems.length === 0 ? (
          <Text style={styles.emptyText}>찜한 물품이 없습니다.</Text>
        ) : (
          <View style={styles.grid}>
            {filteredItems.map(item => (
              <ItemCard
                key={item.id}
                title={item.title}
                price={`${item.creditPrice.toLocaleString()} 크레딧`}
                icon="📦"
                backgroundColor="#EAF2E9"
                imageUrl={getProductImageUrls(item)[0]}
                isLiked={true}
                onPress={() =>
                  navigation.navigate('ProductDetail', {productId: item.id})
                }
                onHeartPress={() => removeLike(item)}
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
    </SafeAreaView>
  );
}
