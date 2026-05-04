import React, {useState} from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {profileEditStyles as styles} from '../styles/ProfileEditScreenStyle';

// 학과 정보 추가 예정
const DEPARTMENTS = [
  '컴퓨터공학과',
  '인공지능공학과',
  '전자공학과',
  '정보통신공학과',
  '기계공학과',
  '산업경영공학과',
  '경영학과',
  '디자인테크놀로지학과',
  '의류디자인학과',
  '기타',
];

// 지금은 백엔드 연동 전이라 예시 회원 데이터로 사용.
// 나중에는 이 부분을 API 응답값으로 대체하면 됨.
const mockUser = {
  nickname: '나봉',
  department: '컴퓨터공학과',
  email: 'nabong@inha.edu',
};

type ModalType =
  | 'logoutConfirm'
  | 'logoutDone'
  | 'withdrawConfirm'
  | 'withdrawDone'
  | null;

export function ProfileEditScreen() {
  const navigation = useNavigation<any>();

  const [nickname, setNickname] = useState(mockUser.nickname);
  const [selectedDepartment, setSelectedDepartment] = useState(
    mockUser.department,
  );
  const [departmentModalVisible, setDepartmentModalVisible] = useState(false);

  const [modalType, setModalType] = useState<ModalType>(null);

  const closeModal = () => {
    setModalType(null);
  };

  const handleProfileUpdate = () => {
    // 나중에 여기서 회원 정보 수정 API 호출하면 됨.
    // 예: updateProfile({nickname, department: selectedDepartment})
    console.log('수정할 회원 정보:', {
      nickname,
      department: selectedDepartment,
      email: mockUser.email,
    });
  };

  const handleLogoutConfirm = () => {
    // 나중에 여기서 토큰 삭제, 로그아웃 API 처리 가능
    setModalType('logoutDone');
  };

  const handleWithdrawConfirm = () => {
    // 나중에 여기서 회원 탈퇴 API 호출 가능
    setModalType('withdrawDone');
  };

  const handleDone = () => {
    setModalType(null);
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Ionicons name="chevron-back" size={26} color="#222222" />
        </Pressable>

        <Text style={styles.headerTitle}>회원 정보 수정</Text>

        <View style={{width: 26}} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.editCard}>
          <View style={styles.profileImageArea}>
            <View style={styles.profileImageOuter}>
              <View style={styles.profileImageInner}>
                <Text style={styles.profileEmoji}>🙂</Text>
              </View>
            </View>

            <Pressable style={styles.cameraButton}>
              <Ionicons name="camera-outline" size={15} color="#555555" />
            </Pressable>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>닉네임</Text>
            <TextInput
              style={styles.input}
              value={nickname}
              onChangeText={setNickname}
              placeholder="닉네임을 입력하세요"
              placeholderTextColor="#999999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>학과</Text>

            <Pressable
              style={styles.selectBox}
              onPress={() => setDepartmentModalVisible(true)}>
              <Text style={styles.selectText}>{selectedDepartment}</Text>
              <Ionicons name="chevron-down" size={18} color="#777777" />
            </Pressable>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>이메일</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={mockUser.email}
              editable={false}
            />
          </View>

          <Pressable style={styles.submitButton} onPress={handleProfileUpdate}>
            <Text style={styles.submitButtonText}>회원 정보 수정하기</Text>
          </Pressable>
        </View>

        <View style={styles.menuList}>
          <Pressable
            style={styles.menuItem}
            onPress={() => setModalType('logoutConfirm')}>
            <Text style={styles.menuText}>로그아웃</Text>
            <Ionicons name="chevron-forward" size={18} color="#777777" />
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => setModalType('withdrawConfirm')}>
            <Text style={styles.menuText}>탈퇴</Text>
            <Ionicons name="chevron-forward" size={18} color="#777777" />
          </Pressable>
        </View>
      </ScrollView>

      <DepartmentSelectModal
        visible={departmentModalVisible}
        departments={DEPARTMENTS}
        selectedDepartment={selectedDepartment}
        onSelect={department => {
          setSelectedDepartment(department);
          setDepartmentModalVisible(false);
        }}
        onClose={() => setDepartmentModalVisible(false)}
      />

      <ConfirmModal
        visible={modalType === 'logoutConfirm'}
        title="로그아웃 하시겠어요?"
        confirmText="확인"
        cancelText="취소"
        onCancel={closeModal}
        onConfirm={handleLogoutConfirm}
      />

      <DoneModal
        visible={modalType === 'logoutDone'}
        title="로그아웃 되었습니다."
        onConfirm={handleDone}
      />

      <ConfirmModal
        visible={modalType === 'withdrawConfirm'}
        title="정말 탈퇴하시겠어요?"
        description="탈퇴 시 모든 정보는 복구되지 않습니다."
        confirmText="확인"
        cancelText="취소"
        onCancel={closeModal}
        onConfirm={handleWithdrawConfirm}
      />

      <DoneModal
        visible={modalType === 'withdrawDone'}
        title="탈퇴되었습니다."
        onConfirm={handleDone}
      />
    </SafeAreaView>
  );
}

function DepartmentSelectModal({
  visible,
  departments,
  selectedDepartment,
  onSelect,
  onClose,
}: {
  visible: boolean;
  departments: string[];
  selectedDepartment: string;
  onSelect: (department: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.departmentSheet}>
          <Text style={styles.departmentSheetTitle}>학과 선택</Text>

          {departments.map(department => {
            const isSelected = selectedDepartment === department;

            return (
              <Pressable
                key={department}
                style={[
                  styles.departmentOption,
                  isSelected && styles.departmentOptionSelected,
                ]}
                onPress={() => onSelect(department)}>
                <Text
                  style={[
                    styles.departmentOptionText,
                    isSelected && styles.departmentOptionTextSelected,
                  ]}>
                  {department}
                </Text>

                {isSelected && (
                  <Ionicons name="checkmark" size={18} color="#79AD6F" />
                )}
              </Pressable>
            );
          })}

          <Pressable style={styles.departmentCancelButton} onPress={onClose}>
            <Text style={styles.departmentCancelText}>닫기</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function ConfirmModal({
  visible,
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  description?: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>{title}</Text>

          {description && (
            <Text style={styles.modalDescription}>{description}</Text>
          )}

          <View style={styles.modalButtonRow}>
            <Pressable style={styles.modalCancelButton} onPress={onCancel}>
              <Text style={styles.modalCancelText}>{cancelText}</Text>
            </Pressable>

            <Pressable style={styles.modalConfirmButton} onPress={onConfirm}>
              <Text style={styles.modalConfirmText}>{confirmText}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function DoneModal({
  visible,
  title,
  onConfirm,
}: {
  visible: boolean;
  title: string;
  onConfirm: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>{title}</Text>

          <Pressable style={styles.doneButton} onPress={onConfirm}>
            <Text style={styles.modalConfirmText}>확인</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}