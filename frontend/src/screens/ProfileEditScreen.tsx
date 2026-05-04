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

type ModalType =
  | 'logoutConfirm'
  | 'logoutDone'
  | 'withdrawConfirm'
  | 'withdrawDone'
  | null;

export function ProfileEditScreen() {
  const navigation = useNavigation<any>();
  const [modalType, setModalType] = useState<ModalType>(null);

  const closeModal = () => {
    setModalType(null);
  };

  const handleLogoutConfirm = () => {
    setModalType('logoutDone');
  };

  const handleWithdrawConfirm = () => {
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
              defaultValue="나봉"
              placeholder="닉네임을 입력하세요"
              placeholderTextColor="#999999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>학과</Text>

            <Pressable style={styles.selectBox}>
              <Text style={styles.selectText}>컴퓨터공학과</Text>
              <Ionicons name="chevron-down" size={18} color="#777777" />
            </Pressable>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>이메일</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value="kimnai6207@inha.edu"
              editable={false}
            />
          </View>

          <Pressable style={styles.submitButton}>
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