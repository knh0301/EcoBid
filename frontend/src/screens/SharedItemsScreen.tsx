import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const CATEGORIES = ['전체', '가구', '가전', '도서', '의류/잡화', '생활용품', '기타'];

const INITIAL_PRODUCTS = [
  {id: '1', name: '빈티지 조명', price: '2,500 크레딧', liked: false},
  {id: '2', name: '곰돌이 인형', price: '500 크레딧', liked: true},
  {id: '3', name: '각티슈 3묶음', price: '500 크레딧', liked: true},
  {id: '4', name: '수저 세트', price: '700 크레딧', liked: false},
  {id: '5', name: '전공책', price: '1,500 크레딧', liked: false},
  {id: '6', name: '스마트폰', price: '10,000 크레딧', liked: false},
];

export function SharedItemsScreen() {
  const navigation = useNavigation<any>();

  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  const toggleLike = (id: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? {...p, liked: !p.liked} : p)),
    );
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>나눔 물품</Text>

        <View style={styles.creditBadge}>
          <Text style={styles.creditBadgeText}>1,250 크레딧</Text>
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
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.productCard}
            onPress={() => navigation.navigate('ProductDetail')}>
            <View style={styles.productImage} />

            <View style={styles.productBottom}>
              <Text style={styles.productName}>{item.name}</Text>

              <TouchableOpacity onPress={() => toggleLike(item.id)}>
                <Text
                  style={[
                    styles.heartIcon,
                    item.liked && {color: '#5C8B5A'},
                  ]}>
                  {item.liked ? '♥' : '♡'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.productPrice}>{item.price}</Text>
          </TouchableOpacity>
        )}
      />

      {/* 등록 FAB */}
      <TouchableOpacity
        style={styles.fab}
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
    backgroundColor: '#DDDDDD',
    borderRadius: 8,
    marginBottom: 8,
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
  },
  heartIcon: {
    fontSize: 18,
    color: '#888888',
  },
  productPrice: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
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