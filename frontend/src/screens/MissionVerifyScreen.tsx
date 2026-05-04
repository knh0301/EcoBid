import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
  Image,
  Dimensions,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const {width} = Dimensions.get('window');
const BOX_SIZE = (width - 55) / 2;

export function MissionVerifyScreen({navigation, route}: any) {
  const {missionTitle} = route.params || {missionTitle: '미션 인증'};
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'photo_error' | 'desc_error'>('success');

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
    } else if (description.trim() === '') {
      setModalType('desc_error');
      setModalVisible(true);
    } else {
      setModalType('success');
      setModalVisible(true);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    if (modalType === 'success') {
      navigation.goBack();
    }
  };

  // 그리드 데이터 구성 (추가버튼 + 이미지들 + 빈칸들)
  const renderGridItem = (index: number) => {
    if (index === 0) {
      // 1번째 칸: 무조건 추가 버튼
      return (
        <TouchableOpacity style={styles.grayBox} onPress={pickImage} activeOpacity={0.7}>
          <Ionicons name="add" size={40} color="#333" />
          <Text style={styles.boxText}>{images.length}/3</Text>
        </TouchableOpacity>
      );
    }

    const imageUri = images[index - 1];
    if (imageUri) {
      // 사진이 있는 칸
      return (
        <View style={styles.grayBox}>
          <Image source={{uri: imageUri}} style={styles.selectedImage} />
          <TouchableOpacity style={styles.removeBtn} onPress={() => removeImage(index - 1)}>
            <Ionicons name="close-circle" size={22} color="#FF4B4B" />
          </TouchableOpacity>
        </View>
      );
    }

    // 빈 칸
    return <View style={styles.grayBox} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{missionTitle}</Text>
        <View style={{width: 28}} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 2x2 고정 그리드 */}
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

        {/* 활동 설명 */}
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

      {/* 하단 영역 */}
      <View style={styles.footer}>
        <Text style={styles.creditText}>+ 500 크레딧</Text>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>크레딧 신청 하기</Text>
        </TouchableOpacity>
      </View>

      {/* 커스텀 모달 */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {modalType === 'success' && (
              <>
                <Text style={styles.modalTitle}>크레딧 신청이 완료되었어요!</Text>
                <Text style={styles.modalSubtitle}>관리자 확인 후 크레딧이 지급됩니다.</Text>
              </>
            )}
            {modalType === 'photo_error' && (
              <Text style={styles.modalTitle}>사진을 한 장 이상 등록해주세요.</Text>
            )}
            {modalType === 'desc_error' && (
              <Text style={styles.modalTitle}>활동 설명을 입력해주세요.</Text>
            )}
            
            <TouchableOpacity style={styles.modalBtn} onPress={handleModalClose}>
              <Text style={styles.modalBtnText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollContent: {
    padding: 20,
  },
  gridContainer: {
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  grayBox: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  removeBtn: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FFF',
    borderRadius: 12,
    zIndex: 1,
  },
  boxText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  section: {
    marginTop: 10,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  inputContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    height: 180,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textInput: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  creditText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5C8B5A',
    textAlign: 'right',
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#86B27A',
    borderRadius: 14,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 25,
    padding: 30,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalBtn: {
    backgroundColor: '#86B27A',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  modalBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
