import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useFocusEffect} from '@react-navigation/native';
import {
  MissionSubmission,
  MissionSubmissionStatus,
  missionsApi,
} from '../api/missions';
import {missionAdminReviewStyles as styles} from '../styles/MissionAdminReviewScreenStyle';
import {colors} from '../styles/colors';

const STATUS_TABS: {label: string; value: MissionSubmissionStatus}[] = [
  {label: '대기', value: 'PENDING'},
  {label: '승인', value: 'APPROVED'},
  {label: '반려', value: 'REJECTED'},
];

const STATUS_LABELS: Record<MissionSubmissionStatus, string> = {
  PENDING: '승인 대기',
  APPROVED: '승인 완료',
  REJECTED: '반려 완료',
};

export function MissionAdminReviewScreen({navigation}: any) {
  const [selectedStatus, setSelectedStatus] =
    useState<MissionSubmissionStatus>('PENDING');
  const [submissions, setSubmissions] = useState<MissionSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [reviewingId, setReviewingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [rejectTarget, setRejectTarget] = useState<MissionSubmission | null>(
    null,
  );
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchSubmissions = useCallback(
    async (showLoading = true) => {
      if (showLoading) {
        setIsLoading(true);
      }

      setErrorMessage('');

      try {
        const nextSubmissions =
          await missionsApi.getAdminMissionSubmissions(selectedStatus);

        setSubmissions(nextSubmissions);
      } catch (err: any) {
        console.warn('Fetch mission submissions error:', err);
        setErrorMessage(
          err?.response?.data?.message ||
            '미션 신청 목록을 불러오지 못했어요.',
        );
      } finally {
        setIsLoading(false);
      }
    },
    [selectedStatus],
  );

  useFocusEffect(
    useCallback(() => {
      fetchSubmissions();
    }, [fetchSubmissions]),
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchSubmissions(false);
    setIsRefreshing(false);
  };

  const handleApprove = (submission: MissionSubmission) => {
    Alert.alert(
      '미션 신청 승인',
      `${submission.Mission?.title || '미션'} 신청을 승인할까요?`,
      [
        {text: '취소', style: 'cancel'},
        {
          text: '승인',
          onPress: () => submitReview(submission.id, 'APPROVE'),
        },
      ],
    );
  };

  const handleRejectPress = (submission: MissionSubmission) => {
    setRejectTarget(submission);
    setRejectionReason('');
  };

  const closeRejectModal = () => {
    if (reviewingId) {
      return;
    }

    setRejectTarget(null);
    setRejectionReason('');
  };

  const handleRejectSubmit = () => {
    const trimmedReason = rejectionReason.trim();

    if (!rejectTarget) {
      return;
    }

    if (!trimmedReason) {
      Alert.alert('반려 사유 입력', '사용자에게 전달할 반려 사유를 입력해주세요.');
      return;
    }

    submitReview(rejectTarget.id, 'REJECT', trimmedReason);
  };

  const submitReview = async (
    submissionId: number,
    action: 'APPROVE' | 'REJECT',
    reason?: string,
  ) => {
    try {
      setReviewingId(submissionId);

      await missionsApi.reviewMissionSubmission(submissionId, action, reason);
      setSubmissions(prev => prev.filter(item => item.id !== submissionId));
      setRejectTarget(null);
      setRejectionReason('');

      Alert.alert(
        '처리 완료',
        action === 'APPROVE'
          ? '미션 신청을 승인하고 크레딧을 지급했어요.'
          : '미션 신청을 반려했어요.',
      );
    } catch (err: any) {
      console.warn('Review mission submission error:', err);
      Alert.alert(
        '처리 실패',
        err?.response?.data?.message || '미션 신청을 처리하지 못했어요.',
      );
    } finally {
      setReviewingId(null);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.stateBox}>
          <ActivityIndicator size="small" color={colors.primaryDark} />
          <Text style={styles.stateText}>신청 목록을 불러오는 중...</Text>
        </View>
      );
    }

    if (errorMessage) {
      return (
        <View style={styles.stateBox}>
          <Ionicons name="alert-circle-outline" size={28} color={colors.error} />
          <Text style={styles.stateText}>{errorMessage}</Text>
          <Pressable style={styles.retryButton} onPress={() => fetchSubmissions()}>
            <Text style={styles.retryButtonText}>다시 불러오기</Text>
          </Pressable>
        </View>
      );
    }

    if (submissions.length === 0) {
      return (
        <View style={styles.stateBox}>
          <Ionicons name="checkmark-done-outline" size={30} color={colors.primaryDark} />
          <Text style={styles.stateText}>표시할 미션 신청이 없어요.</Text>
        </View>
      );
    }

    return submissions.map(submission => (
      <SubmissionCard
        key={submission.id}
        submission={submission}
        isReviewing={reviewingId === submission.id}
        onApprove={() => handleApprove(submission)}
        onReject={() => handleRejectPress(submission)}
      />
    ));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color={colors.textDark} />
        </Pressable>

        <Text style={styles.headerTitle}>미션 승인 관리</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.tabRow}>
        {STATUS_TABS.map(tab => {
          const isSelected = selectedStatus === tab.value;

          return (
            <Pressable
              key={tab.value}
              style={[styles.tabButton, isSelected && styles.tabButtonActive]}
              onPress={() => setSelectedStatus(tab.value)}>
              <Text
                style={[
                  styles.tabButtonText,
                  isSelected && styles.tabButtonTextActive,
                ]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primaryDark}
          />
        }
        showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>

      <Modal
        transparent
        visible={!!rejectTarget}
        animationType="fade"
        onRequestClose={closeRejectModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.rejectModal}>
            <Text style={styles.rejectModalTitle}>반려 사유 입력</Text>
            <Text style={styles.rejectModalDesc}>
              사용자에게 전달할 내용을 적어주세요.
            </Text>

            <TextInput
              style={styles.rejectInput}
              value={rejectionReason}
              onChangeText={setRejectionReason}
              placeholder="예: 사진에서 텀블러 사용 여부가 확인되지 않아요."
              placeholderTextColor={colors.textMuted}
              multiline
              textAlignVertical="top"
              maxLength={300}
            />

            <View style={styles.rejectModalActions}>
              <Pressable
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={closeRejectModal}
                disabled={!!reviewingId}>
                <Text style={styles.modalCancelText}>취소</Text>
              </Pressable>

              <Pressable
                style={[styles.modalButton, styles.modalRejectButton]}
                onPress={handleRejectSubmit}
                disabled={!!reviewingId}>
                {reviewingId ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.modalRejectText}>반려하기</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function SubmissionCard({
  submission,
  isReviewing,
  onApprove,
  onReject,
}: {
  submission: MissionSubmission;
  isReviewing: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  const missionTitle = submission.Mission?.title || '미션';
  const rewardPoints = submission.Mission?.rewardPoints || 0;
  const userName =
    submission.User?.nickname ||
    submission.User?.name ||
    submission.User?.email ||
    '사용자';
  const isPending = submission.status === 'PENDING';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleArea}>
          <Text style={styles.missionTitle} numberOfLines={2}>
            {missionTitle}
          </Text>
          <Text style={styles.userText} numberOfLines={1}>
            {userName}
          </Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            submission.status === 'APPROVED' && styles.statusBadgeApproved,
            submission.status === 'REJECTED' && styles.statusBadgeRejected,
          ]}>
          <Text
            style={[
              styles.statusBadgeText,
              submission.status === 'APPROVED' &&
                styles.statusBadgeTextApproved,
              submission.status === 'REJECTED' &&
                styles.statusBadgeTextRejected,
            ]}>
            {STATUS_LABELS[submission.status]}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>지급 크레딧 {rewardPoints}</Text>
        <Text style={styles.metaDivider}>|</Text>
        <Text style={styles.metaText}>{formatDateTime(submission.createdAt)}</Text>
      </View>

      {submission.content ? (
        <Text style={styles.contentText}>{submission.content}</Text>
      ) : (
        <Text style={styles.emptyContentText}>작성된 인증 내용이 없어요.</Text>
      )}

      {submission.imageUrl ? (
        <Image
          source={{uri: submission.imageUrl}}
          style={styles.proofImage}
          resizeMode="cover"
        />
      ) : null}

      {submission.status === 'REJECTED' && submission.rejectionReason ? (
        <View style={styles.reasonBox}>
          <Text style={styles.reasonTitle}>반려 사유</Text>
          <Text style={styles.reasonText}>{submission.rejectionReason}</Text>
        </View>
      ) : null}

      {isPending ? (
        <View style={styles.actionRow}>
          <Pressable
            style={[styles.reviewButton, styles.rejectButton]}
            onPress={onReject}
            disabled={isReviewing}>
            <Text style={[styles.reviewButtonText, styles.rejectButtonText]}>
              반려
            </Text>
          </Pressable>

          <Pressable
            style={[styles.reviewButton, styles.approveButton]}
            onPress={onApprove}
            disabled={isReviewing}>
            {isReviewing ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.reviewButtonText}>승인</Text>
            )}
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function formatDateTime(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return '날짜 확인 불가';
  }

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${month}/${day} ${hours}:${minutes}`;
}
