import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { productsApi, Product } from '../api/products';

export const ProductDetailScreen: React.FC<any> = ({ navigation, route }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productsApi.getProductById(productId);
        setProduct(data);
      } catch (error) {
        console.error('Fetch product detail error:', error);
        Alert.alert('오류', '상품 정보를 불러오는 중 오류가 발생했습니다.');
        navigation.goBack();
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#5C8B5A" />
      </View>
    );
  }

  if (!product) return null;

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{product.title}</Text>
        <View style={styles.creditBadge}>
          <Text style={styles.creditBadgeText}>{product.creditPrice.toLocaleString()} 크레딧</Text>
        </View>
      </View>

      <ScrollView>
        {/* 이미지 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.imageBox}>
            {product.imageUrl ? (
               <Text style={{ textAlign: 'center', marginTop: 100 }}>이미지 영역</Text>
            ) : (
               <Text style={{ textAlign: 'center', marginTop: 100 }}>이미지 없음</Text>
            )}
          </View>
        </ScrollView>

        <View style={styles.bodyPadding}>
          {/* 판매자 정보 */}
          <View style={styles.sellerRow}>
            <View style={styles.avatar}>
              <Text style={{ fontSize: 20 }}>:)</Text>
            </View>
            <Text style={styles.sellerName}>{product.seller?.name || '익명 사용자'}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('ProductRegister', { isEditMode: true, product })}
              style={{ marginLeft: 'auto' }}>
              <Text style={styles.editLink}>수정하기</Text>
            </TouchableOpacity>
          </View>

          {/* 제목 */}
          <Text style={styles.itemName}>{product.title}</Text>
          <Text style={styles.itemCategory}>{product.status === 'AVAILABLE' ? '나눔 중' : product.status}</Text>

          {/* 설명 */}
          <Text style={styles.itemDesc}>
            {product.description || '상품 설명이 없습니다.'}
          </Text>

          {/* 가격 */}
          <Text style={styles.itemPrice}>{product.creditPrice.toLocaleString()} 크레딧</Text>
        </View>
      </ScrollView>

      {/* 채팅하기 버튼 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigation.navigate('ChatDetail')}>
          <Text style={styles.chatButtonText}>채팅하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  backArrow: {
    fontSize: 18,
    color: '#1A1A1A',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    flex: 1,
    marginHorizontal: 10,
    textAlign: 'center',
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
  imageBox: {
    width: 250,
    height: 250,
    backgroundColor: '#F5F5F5',
    marginRight: 2,
  },
  bodyPadding: {
    padding: 16,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EAF2E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  sellerName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  editLink: {
    fontSize: 13,
    color: '#888888',
    textDecorationLine: 'underline',
    marginLeft: 'auto',
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 13,
    color: '#888888',
    marginBottom: 12,
  },
  itemDesc: {
    fontSize: 14,
    color: '#1A1A1A',
    lineHeight: 22,
    marginBottom: 24,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5C8B5A',
    textAlign: 'right',
  },
  bottomBar: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  chatButton: {
    backgroundColor: '#5C8B5A',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  chatButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});