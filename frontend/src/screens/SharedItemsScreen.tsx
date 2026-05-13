import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {productsApi, Product} from '../api/products';
import {creditsApi} from '../api/creditsApi';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {sharedItemsStyles as styles} from '../styles/SharedItemsScreenStyle';
import {ItemCard} from '../components/ItemCard';

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

  const toggleLike = (id: number) => {
    setLikedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    );
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
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

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#5C8B5A"
          style={styles.loadingIndicator}
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
              <ItemCard
                title={item.title}
                price={`${item.creditPrice.toLocaleString()} 크레딧`}
                icon="📦"
                backgroundColor="#EAF2E9"
                isLiked={isLiked}
                onPress={() =>
                  navigation.navigate('ProductDetail', {productId: item.id})
                }
                onHeartPress={() => toggleLike(item.id)}
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
    </View>
  );
}