import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import {
  productsApi,
  Product,
  getProductImageUrls,
} from '../api/products';
import {creditsApi} from '../api/creditsApi';
import {authApi} from '../api/authApi';
import {chatsApi} from '../api/chats';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {productDetailStyles as styles} from '../styles/ProductDetailScreenStyle';
import {colors} from '../styles/colors';

export const ProductDetailScreen: React.FC<any> = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const {productId} = route.params;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [creditBalance, setCreditBalance] = useState(0);
  const [creditLoading, setCreditLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isChatStarting, setIsChatStarting] = useState(false);

  const fetchProduct = async () => {
    try {
      const [data, user] = await Promise.all([
        productsApi.getProductById(productId),
        authApi.getMe(),
      ]);

      setProduct(data);
      setCurrentUserId(user.id);
    } catch (error) {
      console.error('Fetch product detail error:', error);
      Alert.alert('오류', '상품 정보를 불러오는 중 오류가 발생했습니다.');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCreditBalance = async () => {
    try {
      setCreditLoading(true);

      const balance = await creditsApi.getMyCreditBalance();

      setCreditBalance(balance);
    } catch (error) {
      console.warn('Fetch credit balance error:', error);
      setCreditBalance(0);
    } finally {
      setCreditLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchCreditBalance();
  }, [productId]);

  const imageUrls = useMemo(() => getProductImageUrls(product), [product]);
  const isMyProduct =
    currentUserId !== null && product?.sellerId === currentUserId;

  const navigateToEdit = () => {
    if (!product) {
      return;
    }

    navigation.navigate('ProductRegister', {
      isEditMode: true,
      product,
    });
  };

  const navigateToChat = async () => {
    if (!product || isChatStarting) {
      return;
    }

    try {
      setIsChatStarting(true);

      const room = await chatsApi.createOrGetRoom(product.id);

      navigation.navigate('ChatDetail', {
        roomId: String(room.id),
        name: room.seller?.name || product.seller?.name || '판매자',
        productTitle: room.product?.title || product.title,
        productPrice: `${
          room.product?.creditPrice?.toLocaleString() ||
          product.creditPrice.toLocaleString()
        } 크레딧`,
      });
    } catch (error: any) {
      console.warn('Create chat room error:', error);
      Alert.alert(
        '채팅 오류',
        error.response?.data?.message || '채팅방을 여는 중 오류가 발생했습니다.',
      );
    } finally {
      setIsChatStarting(false);
    }
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          {paddingTop: insets.top},
        ]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.backArrow}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {product.title}
        </Text>

        <View style={styles.creditBadge}>
          <Text style={styles.creditBadgeText}>
            {creditLoading ? '...' : `${creditBalance.toLocaleString()} 크레딧`}
          </Text>
        </View>
      </View>

      <ScrollView>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.imageScrollContent}>
          {imageUrls.length > 0 ? (
            imageUrls.map((imageUrl, index) => (
              <Image
                key={`${imageUrl}-${index}`}
                source={{uri: imageUrl}}
                style={styles.productImage}
                resizeMode="cover"
              />
            ))
          ) : (
            <View style={styles.imageBox}>
              <Text style={styles.imageText}>이미지 없음</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.bodyPadding}>
          <View style={styles.sellerRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>:)</Text>
            </View>

            <Text style={styles.sellerName}>
              {product.seller?.name || '익명 사용자'}
            </Text>
          </View>

          <Text style={styles.itemName}>{product.title}</Text>

          <Text style={styles.itemCategory}>
            {product.category ||
              (product.status === 'AVAILABLE' ? '나눔 중' : product.status)}
          </Text>

          <Text style={styles.itemDesc}>
            {product.description || '상품 설명이 없습니다.'}
          </Text>

          <Text style={styles.itemPrice}>
            {product.creditPrice.toLocaleString()} 크레딧
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, {paddingBottom: insets.bottom + 16}]}>
        <TouchableOpacity
          style={styles.chatButton}
          disabled={isChatStarting}
          onPress={isMyProduct ? navigateToEdit : navigateToChat}>
          <Text style={styles.chatButtonText}>
            {isMyProduct
              ? '수정하기'
              : isChatStarting
                ? '채팅방 여는 중...'
                : '채팅하기'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};