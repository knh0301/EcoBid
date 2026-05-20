import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import {profileEditStyles as styles} from '../styles/ProfileEditScreenStyle';
import {useAuth} from '../context/AuthContext';
import {authApi, resolveProfileImageUrl} from '../api/authApi';

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

type ModalType =
  | 'logoutConfirm'
  | 'logoutDone'
  | 'withdrawConfirm'
  | 'withdrawDone'
  | 'profileDone'
  | 'profileError'
  | null;

type SelectedProfileImage = {
  uri: string;
  base64?: string;
  mimeType?: string;
  imageUrl?: string | null;
};

export function ProfileEditScreen() {
  const navigation = useNavigation<any>();
  const {logout, userInfo} = useAuth();

  const [nickname, setNickname] = useState(
    userInfo?.nickname || userInfo?.name || '',
  );
  const [email, setEmail] = useState(userInfo?.email || '');
  const [profileImage, setProfileImage] = useState<SelectedProfileImage | null>(
    userInfo?.profileImage
      ? {
          uri: resolveProfileImageUrl(userInfo.profileImage) || userInfo.profileImage,
          imageUrl: userInfo.profileImage,
        }
      : null,
  );
  const [selectedDepartment, setSelectedDepartment] = useState(
    userInfo?.department || DEPARTMENTS[0],
  );
  const [departmentModalVisible, setDepartmentModalVisible] = useState(false);

  const [modalType, setModalType] = useState<ModalType>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = await authApi.getMe();

        setNickname(user.nickname || user.name);
        setEmail(user.email);
        setSelectedDepartment(user.department || DEPARTMENTS[0]);
        setProfileImage(
          user.profileImage
            ? {
                uri: resolveProfileImageUrl(user.profileImage) || user.profileImage,
                imageUrl: user.profileImage,
              }
            : null,
        );
      } catch (err) {
        console.warn('Fetch profile error:', err);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  const closeModal = () => {
    setModalType(null);
  };

  const handlePickProfileImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      setModalType('profileError');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (result.canceled || !result.assets?.[0]) {
      return;
    }

    try {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{resize: {width: 512}}],
        {
          compress: 0.85,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        },
      );

      if (!manipulatedImage.uri || !manipulatedImage.base64) {
        setModalType('profileError');
        return;
      }

      setProfileImage({
        uri: manipulatedImage.uri,
        base64: manipulatedImage.base64,
        mimeType: 'image/jpeg',
      });
    } catch (err) {
      console.warn('Pick profile image error:', err);
      setModalType('profileError');
    }
  };

  const handleProfileUpdate = async () => {
    const trimmedNickname = nickname.trim();

    if (!trimmedNickname || isSaving) {
      return;
    }

    try {
      setIsSaving(true);

      let uploadedProfileImage = profileImage?.imageUrl || null;

      if (profileImage?.base64 && profileImage.mimeType) {
        const uploadedImage = await authApi.uploadProfileImage({
          base64: profileImage.base64,
          mimeType: profileImage.mimeType,
        });

        uploadedProfileImage = uploadedImage.imageUrl;
      }

      const updatedUser = await authApi.updateMe({
        nickname: trimmedNickname,
        department: selectedDepartment,
        profileImage: uploadedProfileImage,
      });

      setNickname(updatedUser.nickname || updatedUser.name);
      setEmail(updatedUser.email);
      setSelectedDepartment(updatedUser.department || selectedDepartment);
      setProfileImage(
        updatedUser.profileImage
          ? {
              uri:
                resolveProfileImageUrl(updatedUser.profileImage) ||
                updatedUser.profileImage,
              imageUrl: updatedUser.profileImage,
            }
          : null,
      );
      setModalType('profileDone');
    } catch (err) {
      console.warn('Update profile error:', err);
      setModalType('profileError');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoutConfirm = () => {
    // 나중에 여기서 토큰 삭제, 로그아웃 API 처리 가능
    setModalType('logoutDone');
  };

  const handleWithdrawConfirm = () => {
    // 나중에 여기서 회원 탈퇴 API 호출 가능
    setModalType('withdrawDone');
  };

  const handleDone = async () => {
    const currentModalType = modalType;

    setModalType(null);

    if (currentModalType === 'logoutDone' || currentModalType === 'withdrawDone') {
      await logout();
    }
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

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.editCard}>
          {isLoadingProfile ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color="#79AD6F" />
              <Text style={styles.loadingText}>회원 정보를 불러오는 중...</Text>
            </View>
          ) : null}

          <Pressable
            style={styles.profileImageArea}
            onPress={handlePickProfileImage}>
            <View style={styles.profileImageOuter}>
              <View style={styles.profileImageInner}>
                {profileImage?.uri ? (
                  <Image
                    source={{uri: profileImage.uri}}
                    style={styles.profilePhoto}
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons name="leaf-outline" size={46} color="#7FA56F" />
                )}
              </View>
            </View>

            <Pressable
              style={styles.cameraButton}
              hitSlop={8}
              onPress={handlePickProfileImage}>
              <Ionicons name="camera-outline" size={15} color="#555555" />
            </Pressable>
          </Pressable>

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
              value={email}
              editable={false}
            />
          </View>

          <Pressable
            style={[
              styles.submitButton,
              isSaving && styles.submitButtonDisabled,
            ]}
            disabled={isSaving}
            onPress={handleProfileUpdate}>
            <Text style={styles.submitButtonText}>
              {isSaving ? '저장 중...' : '회원 정보 수정하기'}
            </Text>
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
      </KeyboardAvoidingView>

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

      <DoneModal
        visible={modalType === 'profileDone'}
        title="회원 정보가 수정되었습니다."
        onConfirm={closeModal}
      />

      <DoneModal
        visible={modalType === 'profileError'}
        title="프로필 수정에 실패했어요."
        onConfirm={closeModal}
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
