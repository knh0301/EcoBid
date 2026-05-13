import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {AlertDialog, ConfirmDialog} from '../components/EcoDialog';
import {productsApi, Product} from '../api/products';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {productRegisterStyles as styles} from '../styles/ProductRegisterScreenStyle';

const CATEGORIES = ['가구', '가전', '도서', '의류/잡화', '생활용품', '기타'];

export const ProductRegisterScreen: React.FC<any> = ({navigation, route}) => {
  const insets = useSafeAreaInsets();

  const isEditMode = route?.params?.isEditMode ?? false;
  const initialProduct = route?.params?.product as Product | undefined;

  const [title, setTitle] = useState(
    isEditMode ? initialProduct?.title || '' : '',
  );
  const [price, setPrice] = useState(
    isEditMode ? String(initialProduct?.creditPrice || '') : '',
  );
  const [desc, setDesc] = useState(
    isEditMode ? initialProduct?.description || '' : '',
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    isEditMode ? '기타' : null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertGoHome, setAlertGoHome] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const showAlert = (msg: string, goHome = false) => {
    setAlertMessage(msg);
    setAlertGoHome(goHome);
    setAlertVisible(true);
  };

  const handleAlertConfirm = () => {
    setAlertVisible(false);

    if (alertGoHome) {
      navigation.navigate('MainTabs');
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      showAlert('물품 이름을 적어주세요.');
      return;
    }

    if (!price.trim()) {
      showAlert('가격을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode && initialProduct) {
        await productsApi.updateProduct(initialProduct.id, {
          title,
          description: desc,
          creditPrice: parseInt(price, 10),
        });

        showAlert('나눔 물품글 수정이 완료되었어요!', true);
      } else {
        await productsApi.createProduct({
          title,
          description: desc,
          creditPrice: parseInt(price, 10),
          sellerId: 1,
        });

        showAlert('나눔 물품 등록이 완료되었어요!', true);
      }
    } catch (error) {
      console.error('Submit product error:', error);
      showAlert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!initialProduct) {
      return;
    }

    setConfirmVisible(false);
    setIsSubmitting(true);

    try {
      await productsApi.deleteProduct(initialProduct.id);
      showAlert('나눔 물품글이 삭제되었습니다.', true);
    } catch (error) {
      console.error('Delete product error:', error);
      showAlert('삭제 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {isEditMode ? '나눔 물품 수정' : '나눔 물품 등록'}
        </Text>

        <View style={styles.headerRightSpace} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imagePicker}>
          <TouchableOpacity style={styles.addImageBox}>
            <Text style={styles.addImagePlus}>+</Text>
            <Text style={styles.addImageCount}>0/5</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>물품 이름</Text>
        <TextInput
          style={styles.input}
          placeholder="물품 이름을 입력하세요."
          placeholderTextColor="#888888"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>물품 카테고리</Text>
        <View style={styles.categoryWrap}>
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
        </View>

        <Text style={styles.label}>물품 가격</Text>
        <View style={styles.priceRow}>
          <TextInput
            style={[styles.input, styles.priceInput]}
            placeholder="물품 가격을 입력하세요."
            placeholderTextColor="#888888"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />

          <Text style={styles.creditUnit}>크레딧</Text>
        </View>

        <Text style={[styles.label, styles.descriptionLabel]}>물품 설명</Text>
        <TextInput
          style={styles.textArea}
          placeholder="물품의 상태, 구입 시기, 사용감 등 상세한 정보를 공유해주세요."
          placeholderTextColor="#888888"
          multiline
          numberOfLines={6}
          value={desc}
          onChangeText={setDesc}
          textAlignVertical="top"
        />

        <View style={styles.spacer} />
      </ScrollView>

      {isSubmitting ? (
        <View style={[styles.bottomBar, {paddingBottom: insets.bottom + 16}]}>
          <ActivityIndicator size="small" color="#5C8B5A" />
        </View>
      ) : isEditMode ? (
        <View
          style={[
            styles.editButtonRow,
            {paddingBottom: insets.bottom + 16},
          ]}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => setConfirmVisible(true)}>
            <Text style={styles.deleteButtonText}>삭제</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>수정하기</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.bottomBar, {paddingBottom: insets.bottom + 16}]}>
          <TouchableOpacity
            style={styles.submitButtonFull}
            onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>등록하기</Text>
          </TouchableOpacity>
        </View>
      )}

      <AlertDialog
        visible={alertVisible}
        message={alertMessage}
        onConfirm={handleAlertConfirm}
      />

      <ConfirmDialog
        visible={confirmVisible}
        title="나눔 물품글을 정말 삭제하시겠어요?"
        subtitle="한 번 삭제되면 복구할 수 없습니다."
        cancelLabel="삭제"
        confirmLabel="취소"
        onCancel={handleDeleteConfirm}
        onConfirm={() => setConfirmVisible(false)}
      />
    </View>
  );
};