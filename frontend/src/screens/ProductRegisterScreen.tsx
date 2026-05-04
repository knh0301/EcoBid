import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {ScreenName} from '../types/navigation';
import {AlertDialog, ConfirmDialog} from '../components/EcoDialog';

interface Props {
  go: (screen: ScreenName) => void;
  isEditMode?: boolean;
}

const CATEGORIES = ['가구', '가전', '도서', '의류/잡화', '생활용품', '기타'];

export const ProductRegisterScreen: React.FC<any> = ({
  navigation,
  route,
}) => {
  const isEditMode = route?.params?.isEditMode ?? false;
  const [name, setName] = useState(isEditMode ? '컴공 전공책' : '');
  const [price, setPrice] = useState(isEditMode ? '1500' : '');
  const [desc, setDesc] = useState(
    isEditMode
      ? '전공 평점 4.48 학생이 쓰던 책입니다.\n메모 많이 적었어요.\n취업해서 팔아요.'
      : '',
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    isEditMode ? '도서' : null,
  );
  const [imageCount, setImageCount] = useState(isEditMode ? 3 : 0);

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
    if (alertGoHome) navigation.navigate('SharedItems');
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      showAlert('물품 이름을 적어주세요.');
      return;
    }
    if (isEditMode) {
      showAlert('나눔 물품글 수정이 완료되었어요!', true);
    } else {
      showAlert('나눔 물품 등록이 완료되었어요!', true);
    }
  };

  const handleDeleteConfirm = () => {
    setConfirmVisible(false);
    showAlert('나눔 물품글이 삭제되었습니다.', true);
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>나눔 물품 등록</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* 이미지 피커 */}
        <View style={styles.imagePicker}>
          <TouchableOpacity
            style={styles.addImageBox}
            onPress={() => {
              if (imageCount < 5) setImageCount(c => c + 1);
            }}>
            <Text style={styles.addImagePlus}>+</Text>
            <Text style={styles.addImageCount}>{imageCount}/5</Text>
          </TouchableOpacity>
          {Array.from({length: imageCount}).map((_, i) => (
            <View key={i} style={styles.imageThumb} />
          ))}
        </View>

        {/* 물품 이름 */}
        <Text style={styles.label}>물품 이름</Text>
        <TextInput
          style={styles.input}
          placeholder="물품 이름을 입력하세요."
          placeholderTextColor="#888888"
          value={name}
          onChangeText={setName}
        />

        {/* 물품 카테고리 */}
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

        {/* 물품 가격 */}
        <Text style={styles.label}>물품 가격</Text>
        <View style={styles.priceRow}>
          <TextInput
            style={[styles.input, {flex: 1, marginBottom: 0}]}
            placeholder="물품 가격을 입력하세요."
            placeholderTextColor="#888888"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
          <Text style={styles.creditUnit}>크레딧</Text>
        </View>

        {/* 물품 설명 */}
        <Text style={[styles.label, {marginTop: 20}]}>물품 설명</Text>
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
        <View style={{height: 100}} />
      </ScrollView>

      {/* 하단 버튼 */}
      {isEditMode ? (
        <View style={styles.editButtonRow}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => setConfirmVisible(true)}>
            <Text style={styles.deleteButtonText}>삭제</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>수정하기</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.submitButtonFull}
            onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>등록하기</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 알림 다이얼로그 */}
      <AlertDialog
        visible={alertVisible}
        message={alertMessage}
        onConfirm={handleAlertConfirm}
      />

      {/* 삭제 확인 다이얼로그 */}
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
  content: {
    padding: 16,
  },
  imagePicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  addImageBox: {
    width: 90,
    height: 90,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImagePlus: {
    fontSize: 22,
    color: '#888888',
  },
  addImageCount: {
    fontSize: 12,
    color: '#888888',
  },
  imageThumb: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#DDDDDD',
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 14,
    color: '#1A1A1A',
    marginBottom: 20,
  },
  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: '#FFFFFF',
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
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 0,
  },
  creditUnit: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 14,
    fontSize: 14,
    color: '#1A1A1A',
    minHeight: 140,
  },
  bottomBar: {
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  submitButtonFull: {
    backgroundColor: '#5C8B5A',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  editButtonRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#F5F5F5',
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  submitButton: {
    flex: 3,
    backgroundColor: '#5C8B5A',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});