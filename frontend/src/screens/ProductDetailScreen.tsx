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
  ProductTradeStatus,
  getProductImageUrls,
} from '../api/products';
import {creditsApi} from '../api/creditsApi';
import {authApi, resolveProfileImageUrl} from '../api/authApi';
import {chatsApi} from '../api/chats';
import {Ionicons} from '@expo/vector-icons';
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
  const [tradeStatus, setTradeStatus] = useState<ProductTradeStatus | null>(
    null,
  );
  const [tradeActionLoading, setTradeActionLoading] = useState(false);

  const fetchProduct = async () => {
    try {
      const [data, user] = await Promise.all([
        productsApi.getProductById(productId),
        authApi.getMe(),
      ]);
      const status = await productsApi.getTradeStatus(productId);

      setProduct(data);
      setCurrentUserId(user.id);
      setTradeStatus(status);
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
  const sellerProfileImageUri = resolveProfileImageUrl(product?.seller?.profileImage);
  const isMyProduct =
    currentUserId !== null && product?.sellerId === currentUserId;
  const isSold = product?.status === 'SOLD' || tradeStatus?.isCompleted;
  const isReservedByAnotherBuyer =
    product?.status === 'RESERVED' && !tradeStatus?.hasPaid;

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
        name:
          room.seller?.nickname ||
          room.seller?.name ||
          product.seller?.nickname ||
          product.seller?.name ||
          '판매자',
        productTitle: room.product?.title || product.title,
        productImageUrl: room.product?.imageUrl || imageUrls[0] || null,
        productPrice: `${
          room.product?.creditPrice?.toLocaleString() ||
          product.creditPrice.toLocaleString()
        } 크레딧`,
        profileImage:
          room.seller?.profileImage || product.seller?.profileImage || null,
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

  const handleSendCredits = async () => {
    if (!product || tradeActionLoading) {
      return;
    }

    if (creditBalance < product.creditPrice) {
      Alert.alert(
        '크레딧 부족',
        `${product.creditPrice.toLocaleString()} 크레딧이 필요합니다.`,
      );
      return;
    }

    Alert.alert(
      '크레딧 보내기',
      `${product.creditPrice.toLocaleString()} 크레딧을 판매자에게 보낼까요?`,
      [
        {text: '취소', style: 'cancel'},
        {
          text: '보내기',
          onPress: async () => {
            try {
              setTradeActionLoading(true);

              const result = await productsApi.sendCredits(product.id);

              setProduct(result.product);
              setCreditBalance(result.balance);
              setTradeStatus(prev => ({
                ...(prev || {
                  isSeller: false,
                  isCompleted: false,
                  creditTransferAmount: product.creditPrice,
                  creditTransferredAt: null,
                  room: result.room,
                }),
                hasPaid: true,
                canComplete: result.canComplete,
                room: result.room,
              }));

              Alert.alert(
                '전송 완료',
                '크레딧 전송 내역이 채팅방에 남았습니다. 이제 거래완료를 할 수 있습니다.',
              );
            } catch (error: any) {
              console.warn('Send product credits error:', error);
              Alert.alert(
                '전송 실패',
                error.response?.data?.message ||
                  '크레딧을 보내는 중 오류가 발생했습니다.',
              );
            } finally {
              setTradeActionLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleCompleteTrade = async () => {
    if (!product || tradeActionLoading) {
      return;
    }

    Alert.alert('거래완료', '이 물품 거래를 완료 처리할까요?', [
      {text: '취소', style: 'cancel'},
      {
        text: '완료',
        onPress: async () => {
          try {
            setTradeActionLoading(true);

            const result = await productsApi.completeTrade(product.id);

            setProduct(result.product);
            setTradeStatus(prev => ({
              ...(prev || {
                isSeller: false,
                hasPaid: true,
                creditTransferAmount: product.creditPrice,
                creditTransferredAt: null,
                room: result.room,
              }),
              isCompleted: result.isCompleted,
              canComplete: result.canComplete,
              room: result.room,
            }));

            Alert.alert('완료', '거래가 완료되었습니다.');
          } catch (error: any) {
            console.warn('Complete product trade error:', error);
            Alert.alert(
              '완료 실패',
              error.response?.data?.message ||
                '거래완료 처리 중 오류가 발생했습니다.',
            );
          } finally {
            setTradeActionLoading(false);
          }
        },
      },
    ]);
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
              {sellerProfileImageUri ? (
                <Image
                  source={{uri: sellerProfileImageUri}}
                  style={styles.avatarPhoto}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="leaf-outline" size={24} color="#7FA56F" />
              )}
            </View>

            <Text style={styles.sellerName}>
              {product.seller?.nickname || product.seller?.name || '익명 사용자'}
            </Text>
          </View>

          <Text style={styles.itemName}>{product.title}</Text>

          <Text style={styles.itemCategory}>
            {product.category ||
              (product.status === 'AVAILABLE'
                ? '나눔 중'
                : product.status === 'RESERVED'
                  ? '거래 진행 중'
                  : '거래 완료')}
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
        {isMyProduct ? (
          <TouchableOpacity style={styles.chatButton} onPress={navigateToEdit}>
            <Text style={styles.chatButtonText}>수정하기</Text>
          </TouchableOpacity>
        ) : isSold ? (
          <View style={styles.disabledTradeButton}>
            <Text style={styles.disabledTradeButtonText}>거래 완료된 물품</Text>
          </View>
        ) : isReservedByAnotherBuyer ? (
          <View style={styles.disabledTradeButton}>
            <Text style={styles.disabledTradeButtonText}>거래 진행 중</Text>
          </View>
        ) : (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.chatButton, styles.secondaryActionButton]}
              disabled={isChatStarting || tradeActionLoading}
              onPress={navigateToChat}>
              <Text style={styles.chatButtonText}>
                {isChatStarting ? '채팅방 여는 중...' : '채팅하기'}
              </Text>
            </TouchableOpacity>

            {tradeStatus?.hasPaid ? (
              <TouchableOpacity
                style={[styles.chatButton, styles.primaryActionButton]}
                disabled={!tradeStatus.canComplete || tradeActionLoading}
                onPress={handleCompleteTrade}>
                <Text style={styles.chatButtonText}>
                  {tradeActionLoading ? '처리 중...' : '거래완료'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.chatButton, styles.primaryActionButton]}
                disabled={tradeActionLoading || creditLoading}
                onPress={handleSendCredits}>
                <Text style={styles.chatButtonText}>
                  {tradeActionLoading ? '전송 중...' : '크레딧 보내기'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
};
