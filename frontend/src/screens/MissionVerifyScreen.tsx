import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {missionVerifyStyles as styles} from '../styles/MissionVerifyScreenStyle';
import {missionsApi} from '../api/missions';

type ModalType = 'success' | 'photo_error' | 'desc_error' | 'api_error';

export function MissionVerifyScreen({navigation, route}: any) {
  const insets = useSafeAreaInsets();
  const {missionTitle = '미션 인증', rewardPoints = 50} = route.params || {};
  const rewardAmount = Number(rewardPoints) || 50;

  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('success');
  const [modalMessage, setModalMessage] = useState('');
  const [awardedRewardPoints, setAwardedRewardPoints] = useState(rewardAmount);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImage = async () => {
    if (images.length >= 3) {
      alert('사진은 최대 3장까지 등록 가능합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const prepareImageForSubmission = async (uri: string) => {
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{resize: {width: 1080}}],
      {
        compress: 0.75,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      },
    );

    return {
      uri: manipulatedImage.uri,
      base64: manipulatedImage.base64 || null,
      mimeType: 'image/jpeg',
    };
  };

  const handleSubmit = async () => {
    if (images.length === 0) {
      setModalType('photo_error');
      setModalVisible(true);
      return;
    }

    if (description.trim() === '') {
      setModalType('desc_error');
      setModalVisible(true);
      return;
    }

    try {
      setIsSubmitting(true);
      const imageForSubmission = await prepareImageForSubmission(images[0]);
      const result = await missionsApi.submitMission({
        missionTitle,
        content: description.trim(),
        imageUrl: imageForSubmission.uri || images[0] || null,
        imageBase64: imageForSubmission.base64,
        imageMimeType: imageForSubmission.mimeType,
        rewardPoints: rewardAmount,
      });

      setAwardedRewardPoints(result.requestedRewardPoints || result.rewardPoints);
      setModalMessage(
        result.submission?.status === 'APPROVED'
          ? `${result.rewardPoints.toLocaleString()} 크레딧이 지급되었습니다.`
          : '사진이 명확하지 않아 관리자가 확인할 예정입니다.',
      );
      setModalType('success');
      setModalVisible(true);
    } catch (err: any) {
      console.warn('Submit mission error:', err);
      setModalMessage(
        err?.response?.data?.message ||
          '미션 인증에 실패했어요. 잠시 후 다시 시도해주세요.',
      );
      setModalType('api_error');
      setModalVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);

    if (modalType === 'success') {
      navigation.goBack();
    }
  };

  const renderGridItem = (index: number) => {
    if (index === 0) {
      return (
        <TouchableOpacity
          style={styles.grayBox}
          onPress={pickImage}
          activeOpacity={0.7}>
          <Ionicons name="add" size={40} color="#333" />
          <Text style={styles.boxText}>{images.length}/3</Text>
        </TouchableOpacity>
      );
    }

    const imageUri = images[index - 1];

    if (imageUri) {
      return (
        <View style={styles.grayBox}>
          <Image source={{uri: imageUri}} style={styles.selectedImage} />

          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => removeImage(index - 1)}>
            <Ionicons name="close-circle" size={22} color="#FF4B4B" />
          </TouchableOpacity>
        </View>
      );
    }

    return <View style={styles.grayBox} />;
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{missionTitle}</Text>

        <View style={styles.headerRightSpace} />
      </View>

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.gridContainer}>
          <View style={styles.row}>
            {renderGridItem(0)}
            {renderGridItem(1)}
          </View>

          <View style={styles.row}>
            {renderGridItem(2)}
            {renderGridItem(3)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>활동 설명</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="한 활동에 대해서 간단히 설명해주세요."
              placeholderTextColor="#999"
              multiline
              value={description}
              onChangeText={setDescription}
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, {paddingBottom: insets.bottom + 20}]}>
        <Text style={styles.creditText}>
          + {rewardAmount.toLocaleString()} 크레딧
        </Text>

        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled,
          ]}
          disabled={isSubmitting}
          onPress={handleSubmit}>
          <Text style={styles.submitText}>
            {isSubmitting ? '제출 중...' : '인증 신청 하기'}
          </Text>
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {modalType === 'success' && (
              <>
                <Text style={styles.modalTitle}>
                  {modalMessage.includes('지급')
                    ? 'AI 인증 완료!'
                    : '관리자 확인 대기 중이에요'}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {modalMessage ||
                    `관리자가 승인하면 ${awardedRewardPoints.toLocaleString()} 크레딧이 지급됩니다.`}
                </Text>
              </>
            )}

            {modalType === 'photo_error' && (
              <Text style={styles.modalTitle}>
                사진을 한 장 이상 등록해주세요.
              </Text>
            )}

            {modalType === 'desc_error' && (
              <Text style={styles.modalTitle}>활동 설명을 입력해주세요.</Text>
            )}

            {modalType === 'api_error' && (
              <Text style={styles.modalTitle}>{modalMessage}</Text>
            )}

            <TouchableOpacity
              style={styles.modalBtn}
              onPress={handleModalClose}>
              <Text style={styles.modalBtnText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
