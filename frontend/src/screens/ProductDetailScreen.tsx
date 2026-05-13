import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {productsApi, Product} from '../api/products';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {productDetailStyles as styles} from '../styles/ProductDetailScreenStyle';

export const ProductDetailScreen: React.FC<any> = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const {productId} = route.params;

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
  }, [productId, navigation]);

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          {paddingTop: insets.top},
        ]}>
        <ActivityIndicator size="large" color="#5C8B5A" />
      </View>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {product.title}
        </Text>

        <View style={styles.creditBadge}>
          <Text style={styles.creditBadgeText}>
            {product.creditPrice.toLocaleString()} 크레딧
          </Text>
        </View>
      </View>

      <ScrollView>
        {/* 이미지 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.imageBox}>
            {product.imageUrl ? (
              <Text style={styles.imageText}>이미지 영역</Text>
            ) : (
              <Text style={styles.imageText}>이미지 없음</Text>
            )}
          </View>
        </ScrollView>

        <View style={styles.bodyPadding}>
          {/* 판매자 정보 */}
          <View style={styles.sellerRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>:)</Text>
            </View>

            <Text style={styles.sellerName}>
              {product.seller?.name || '익명 사용자'}
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ProductRegister', {
                  isEditMode: true,
                  product,
                })
              }
              style={styles.editButton}>
              <Text style={styles.editLink}>수정하기</Text>
            </TouchableOpacity>
          </View>

          {/* 제목 */}
          <Text style={styles.itemName}>{product.title}</Text>

          <Text style={styles.itemCategory}>
            {product.status === 'AVAILABLE' ? '나눔 중' : product.status}
          </Text>

          {/* 설명 */}
          <Text style={styles.itemDesc}>
            {product.description || '상품 설명이 없습니다.'}
          </Text>

          {/* 가격 */}
          <Text style={styles.itemPrice}>
            {product.creditPrice.toLocaleString()} 크레딧
          </Text>
        </View>
      </ScrollView>

      {/* 채팅하기 버튼 */}
      <View style={[styles.bottomBar, {paddingBottom: insets.bottom + 16}]}>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigation.navigate('ChatDetail')}>
          <Text style={styles.chatButtonText}>채팅하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};