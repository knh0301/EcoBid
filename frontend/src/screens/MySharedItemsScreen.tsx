import React, {useEffect, useMemo, useState} from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {mySharedItemsStyles as styles} from '../styles/MySharedItemsScreenStyle';
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

const SHARED_ITEMS = [
  {
    id: 1,
    title: '컴공 전공책',
    price: '1,500 크레딧',
    category: '도서',
    icon: '📖',
    backgroundColor: '#D8E7DD',
  },
];

export function MySharedItemsScreen() {
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
      return SHARED_ITEMS;
    }

    return SHARED_ITEMS.filter(item => item.category === selectedCategory);
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
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}