import React, {useEffect, useMemo, useState} from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {mySharedItemsStyles as styles} from '../styles/MySharedItemsScreenStyle';
import {creditsApi} from '../api/creditsApi';

const CATEGORIES = ['전체', '가구', '가전', '도서', '의류/잡화'];

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

      <View style={styles.categoryArea}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}>
          {CATEGORIES.map(category => {
            const isSelected = selectedCategory === category;

            return (
              <Pressable
                key={category}
                style={[
                  styles.categoryChip,
                  isSelected && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(category)}>
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextActive,
                  ]}>
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {filteredItems.map(item => (
            <Pressable
              key={item.id}
              style={styles.itemCard}
              onPress={() => navigation.navigate('ProductDetail')}>
              <View
                style={[
                  styles.itemImage,
                  {backgroundColor: item.backgroundColor},
                ]}>
                <Text style={styles.itemIcon}>{item.icon}</Text>
              </View>

              <View style={styles.itemInfoRow}>
                <View style={styles.itemTextBox}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemPrice}>{item.price}</Text>
                </View>

                <Ionicons name="heart" size={27} color="#2F6F3E" />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}