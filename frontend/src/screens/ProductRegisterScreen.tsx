import React, {useState} from 'react';
import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import {AlertDialog, ConfirmDialog} from '../components/EcoDialog';
import {
  productsApi,
  Product,
  resolveProductImageUrl,
} from '../api/products';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {productRegisterStyles as styles} from '../styles/ProductRegisterScreenStyle';
import {colors} from '../styles/colors';

const CATEGORIES = ['가구', '가전', '도서', '의류/잡화', '생활용품', '기타'];

type SelectedImage = {
  uri: string;
  imageUrl?: string;
  base64?: string;
  mimeType?: string;
};

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

  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>(() => {
    const initialImageUrls = initialProduct?.images?.length
      ? [...initialProduct.images]
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map(image => image.imageUrl)
      : initialProduct?.imageUrl
        ? [initialProduct.imageUrl]
        : [];

    return initialImageUrls
      .map(imageUrl => ({
        uri: resolveProductImageUrl(imageUrl) || imageUrl,
        imageUrl,
      }))
      .slice(0, 5);
  });

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

  const getFallbackMimeType = (uri: string) => {
    const lowerUri = uri.toLowerCase();

    if (lowerUri.endsWith('.png')) {
      return 'image/png';
    }

    if (lowerUri.endsWith('.webp')) {
      return 'image/webp';
    }

    return 'image/jpeg';
  };

  const handlePickImages = async () => {
    if (selectedImages.length >= 5) {
      showAlert('사진은 최대 5장까지 등록할 수 있습니다.');
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      showAlert('사진을 선택하려면 앨범 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5 - selectedImages.length,
      quality: 0.8,
    });

    if (result.canceled) {
      return;
    }

    try {
      const convertedImages: SelectedImage[] = [];

      for (const asset of result.assets) {
        if (!asset.uri) {
          continue;
        }

        const manipulatedImage = await ImageManipulator.manipulateAsync(
          asset.uri,
          [{resize: {width: 1080}}],
          {
            compress: 0.7,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true,
          },
        );

        if (!manipulatedImage.uri || !manipulatedImage.base64) {
          continue;
        }

        convertedImages.push({
          uri: manipulatedImage.uri,
          base64: manipulatedImage.base64,
          mimeType: 'image/jpeg',
        });
      }

      if (convertedImages.length === 0) {
        showAlert('사진 정보를 불러오지 못했습니다. 다시 선택해주세요.');
        return;
      }

      setSelectedImages(prev => [...prev, ...convertedImages].slice(0, 5));
    } catch (error) {
      console.error('Image convert error:', error);
      showAlert('사진을 처리하는 중 오류가 발생했습니다.');
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev =>
      prev.filter((_, imageIndex) => imageIndex !== index),
    );
  };

  const uploadSelectedImages = async () => {
    const imageUrls = await Promise.all(
      selectedImages.map(async image => {
        if (!image.base64) {
          return image.imageUrl || image.uri;
        }

        const uploadedImage = await productsApi.uploadProductImage({
          base64: image.base64,
          mimeType: image.mimeType || getFallbackMimeType(image.uri),
        });

        return uploadedImage.imageUrl;
      }),
    );

    return imageUrls;
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

    const parsedPrice = Number(price.replace(/,/g, ''));

    if (!Number.isInteger(parsedPrice) || parsedPrice <= 0) {
      showAlert('가격은 1 이상의 숫자로 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const imageUrls = await uploadSelectedImages();

      if (isEditMode && initialProduct) {
        await productsApi.updateProduct(initialProduct.id, {
          title,
          description: desc,
          creditPrice: parsedPrice,
          imageUrl: imageUrls[0],
          imageUrls,
        });

        showAlert('나눔 물품글 수정이 완료되었어요!', true);
      } else {
        await productsApi.createProduct({
          title,
          description: desc,
          creditPrice: parsedPrice,
          imageUrl: imageUrls[0],
          imageUrls,
          sellerId: 1,
        });

        showAlert('나눔 물품 등록이 완료되었어요!', true);
      }
    } catch (error: any) {
      console.error('Submit product error:', error);
      console.log('status:', error.response?.status);
      console.log('data:', error.response?.data);

      showAlert(
        error.response?.data?.message || '저장 중 오류가 발생했습니다.',
      );
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
    } catch (error: any) {
      console.error('Delete product error:', error);
      console.log('status:', error.response?.status);
      console.log('data:', error.response?.data);

      showAlert(
        error.response?.data?.message || '삭제 중 오류가 발생했습니다.',
      );
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
          {selectedImages.map((image, index) => (
            <TouchableOpacity
              key={`${image.uri}-${index}`}
              style={styles.imagePreviewBox}
              onPress={handlePickImages}
              activeOpacity={0.85}>
              <Image
                source={{uri: image.uri}}
                style={styles.imagePreview}
                resizeMode="cover"
              />

              <View style={styles.imageChangeBadge}>
                <Text style={styles.imageChangeText}>
                  {index + 1}/{selectedImages.length}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.imageRemoveButton}
                onPress={() => handleRemoveImage(index)}
                hitSlop={8}>
                <Text style={styles.imageRemoveText}>×</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}

          {selectedImages.length < 5 && (
            <TouchableOpacity
              style={styles.addImageBox}
              onPress={handlePickImages}>
              <Text style={styles.addImagePlus}>+</Text>
              <Text style={styles.addImageCount}>
                {selectedImages.length}/5
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.label}>물품 이름</Text>
        <TextInput
          style={styles.input}
          placeholder="물품 이름을 입력하세요."
          placeholderTextColor={colors.textMuted}
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
            placeholderTextColor={colors.textMuted}
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
          placeholderTextColor={colors.textMuted}
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
          <ActivityIndicator size="small" color={colors.primary} />
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