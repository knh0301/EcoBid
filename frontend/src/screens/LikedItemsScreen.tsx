import React, {useEffect, useMemo, useState} from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {likedItemsStyles as styles} from '../styles/LikedItemsScreenStyle';
import {creditsApi} from '../api/creditsApi';
import {ItemCard} from '../components/ItemCard';
import {CategoryFilter} from '../components/CategoryFilter';

const CATEGORIES = [
  '전체',
  '가구',
  '가전',
  '도서',
  '의류/잡화',
  '생활용품',
  '기타',
];

const LIKED_ITEMS = [
  {
    id: 1,
    title: '곰돌이 인형',
    price: '500 크레딧',
    category: '가구',
    icon: '🧸',
    backgroundColor: '#D9902F',
  },
  {
    id: 2,
    title: '각티슈 3묶음',
    price: '500 크레딧',
    category: '생활용품',
    icon: '🧻',
    backgroundColor: '#E8D7BF',
  },
  {
    id: 3,
    title: '아이폰 6',
    price: '200,000 크레딧',
    category: '가전',
    icon: '📱',
    backgroundColor: '#D9D9D9',
  },
];

export function LikedItemsScreen() {
  const navigation = useNavigation<any>();

  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [creditBalance, setCreditBalance] = useState(0);
  const [creditLoading, setCreditLoading] = useState(true);

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
    fetchCreditBalance();
  }, []);

  const filteredItems = useMemo(() => {
    if (selectedCategory === '전체') {
      return LIKED_ITEMS;
    }

    return LIKED_ITEMS.filter(item => item.category === selectedCategory);
  }, [selectedCategory]);

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
        <View style={styles.grid}>
          {filteredItems.map(item => (
            <ItemCard
              key={item.id}
              title={item.title}
              price={item.price}
              icon={item.icon}
              backgroundColor={item.backgroundColor}
              isLiked={true}
              onPress={() =>
                navigation.navigate('ProductDetail', {productId: item.id})
              }
              onHeartPress={() => {
                console.log('찜 해제:', item.id);
              }}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}