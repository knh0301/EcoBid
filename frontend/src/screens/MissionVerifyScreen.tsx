import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Image,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {missionVerifyStyles as styles} from '../styles/MissionVerifyScreenStyle';

type ModalType = 'success' | 'photo_error' | 'desc_error';

export function MissionVerifyScreen({navigation, route}: any) {
  const insets = useSafeAreaInsets();
  const {missionTitle} = route.params || {missionTitle: '미션 인증'};

  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('success');

  const pickImage = async () => {
    if (images.length >= 3) {
      alert('사진은 최대 3장까지 등록 가능합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  const handleSubmit = () => {
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

    setModalType('success');
    setModalVisible(true);
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

      <ScrollView contentContainerStyle={styles.scrollContent}>
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
        <Text style={styles.creditText}>+ 500 크레딧</Text>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>크레딧 신청 하기</Text>
        </TouchableOpacity>
      </View>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {modalType === 'success' && (
              <>
                <Text style={styles.modalTitle}>
                  크레딧 신청이 완료되었어요!
                </Text>
                <Text style={styles.modalSubtitle}>
                  관리자 확인 후 크레딧이 지급됩니다.
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