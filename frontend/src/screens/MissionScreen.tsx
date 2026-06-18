import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Share,
  Text,
  View,
  TouchableOpacity,
  type DimensionValue,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {missionStyles} from '../styles/MissionScreenStyle';
import {
  AdViewStatus,
  DailyMission,
  DailyMissionsProgress,
  missionsApi,
} from '../api/missions';

type MissionStatus =
  | 'active'
  | 'completed'
  | 'locked'
  | 'pending'
  | 'rejected';

type MissionCardItem = {
  id: string;
  title: string;
  desc: string;
  credit: string;
  rewardPoints?: number;
  buttonText: string;
  status: MissionStatus;
  rejectionReason?: string | null;
};

const BASE_MISSION_DATA: MissionCardItem[] = [
  {
    id: '1',
    title: '오늘의 출석 도장',
    desc: '매일 출석하고 크레딧을 받아보세요!',
    credit: '',
    buttonText: '출석하기',
    status: 'active',
  },
  {
    id: '2',
    title: '나눔 물품 등록하기',
    desc: '나눔 물품을 등록하면 100 크레딧을 지급해드려요.',
    credit: '+ 100 크레딧',
    buttonText: '나눔 물품 등록하기',
    status: 'active',
  },
  {
    id: '3',
    title: '친구 초대하기',
    desc: '친구에게 EcoBid를 공유하고 함께 친환경 나눔을 시작해요.',
    credit: '+ 200 크레딧',
    rewardPoints: 200,
    buttonText: '초대하기',
    status: 'active',
  },
  {
    id: '4',
    title: '광고 보기',
    desc: '짧은 광고를 시청하고 EcoBid 운영을 함께 응원해주세요.',
    credit: '+ 20 크레딧',
    rewardPoints: 20,
    buttonText: '광고보기',
    status: 'active',
  },
];

const toMissionCardItem = (mission: DailyMission): MissionCardItem => ({
  id: mission.id,
  title: mission.title,
  desc: mission.desc || mission.description,
  credit: mission.creditText,
  rewardPoints: mission.rewardPoints,
  buttonText: mission.buttonText,
  status: mission.status,
  rejectionReason: mission.rejectionReason,
});

const DEFAULT_DAILY_PROGRESS: DailyMissionsProgress = {
  earnedRewardPoints: 0,
  maxRewardPoints: 50,
  completedMissionCount: 0,
  maxMissionCount: 5,
};

const DEFAULT_AD_VIEW_STATUS: AdViewStatus = {
  completedCount: 0,
  maxCount: 3,
  remainingCount: 3,
  rewardPoints: 20,
  earnedRewardPoints: 0,
  status: 'active',
  buttonText: '광고보기',
};

const MissionCard = ({
  item,
  isLoading,
  onPress,
}: {
  item: MissionCardItem;
  isLoading: boolean;
  onPress: () => void;
}) => {
  const isActionable = item.status === 'active' || item.status === 'rejected';

  return (
    <View style={missionStyles.card}>
      <View style={missionStyles.cardHeader}>
        <Text style={missionStyles.cardTitle}>{item.title}</Text>

        {item.credit ? (
          <Text style={missionStyles.cardCredit}>{item.credit}</Text>
        ) : null}
      </View>

      <Text style={missionStyles.cardDesc}>{item.desc}</Text>

      {item.status === 'rejected' && item.rejectionReason ? (
        <View style={missionStyles.rejectionBox}>
          <Text style={missionStyles.rejectionTitle}>반려 사유</Text>
          <Text style={missionStyles.rejectionText}>{item.rejectionReason}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={[
          missionStyles.button,
          !isActionable && missionStyles.buttonCompleted,
        ]}
        activeOpacity={0.7}
        disabled={!isActionable || isLoading}
        onPress={onPress}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text
            style={[
              missionStyles.buttonText,
              !isActionable && missionStyles.buttonTextCompleted,
            ]}>
            {item.buttonText}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export function MissionScreen({navigation}: any) {
  const insets = useSafeAreaInsets();
  const [submittingMissionId, setSubmittingMissionId] = useState<string | null>(
    null,
  );
  const [dailyMissions, setDailyMissions] = useState<MissionCardItem[]>([]);
  const [dailyProgress, setDailyProgress] = useState<DailyMissionsProgress>(
    DEFAULT_DAILY_PROGRESS,
  );
  const [adViewStatus, setAdViewStatus] = useState<AdViewStatus>(
    DEFAULT_AD_VIEW_STATUS,
  );
  const [dailyMissionsLoading, setDailyMissionsLoading] = useState(true);
  const [dailyMissionsError, setDailyMissionsError] = useState('');
  const missionData = BASE_MISSION_DATA.map(item => {
    if (item.title !== '광고 보기') {
      return item;
    }

    return {
      ...item,
      credit: `+ ${adViewStatus.rewardPoints.toLocaleString()} 크레딧`,
      buttonText: adViewStatus.buttonText,
      status: adViewStatus.status,
    };
  });
  const earnedDailyRewardPoints = Math.min(
    dailyProgress.earnedRewardPoints,
    dailyProgress.maxRewardPoints,
  );
  const dailyProgressPercent: DimensionValue =
    dailyProgress.maxRewardPoints > 0
      ? `${Math.round(
          (earnedDailyRewardPoints / dailyProgress.maxRewardPoints) * 100,
        )}%`
      : '0%';

  const fetchDailyMissions = useCallback(async () => {
    setDailyMissionsLoading(true);
    setDailyMissionsError('');

    try {
      const result = await missionsApi.getDailyMissions();

      setDailyMissions(result.missions.map(toMissionCardItem));
      setDailyProgress(result.progress);
    } catch (error) {
      console.warn('Fetch daily missions error:', error);
      setDailyMissionsError('데일리 미션 정보를 불러오지 못했어요.');
    } finally {
      setDailyMissionsLoading(false);
    }
  }, []);

  const fetchAdViewStatus = useCallback(async () => {
    try {
      const status = await missionsApi.getAdViewStatus();

      setAdViewStatus(status);
    } catch (error) {
      console.warn('Fetch ad view status error:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDailyMissions();
      fetchAdViewStatus();
    }, [fetchAdViewStatus, fetchDailyMissions]),
  );

  const handleFriendInvite = async (item: MissionCardItem) => {
    try {
      setSubmittingMissionId(item.id);

      const shareResult = await Share.share({
        title: 'EcoBid 친구 초대',
        message:
          'EcoBid에서 안 쓰는 물건을 나누고 친환경 미션으로 크레딧도 모아봐!',
      });

      if (shareResult.action === Share.dismissedAction) {
        return;
      }

      const result = await missionsApi.submitMission({
        missionTitle: item.title,
        content: '친구에게 EcoBid 초대 메시지를 공유했습니다.',
        rewardPoints: item.rewardPoints,
      });

      Alert.alert(
        '친구 초대 완료',
        `${result.rewardPoints.toLocaleString()} 크레딧이 지급되었습니다.`,
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        '친구 초대 보상을 지급하지 못했습니다. 다시 시도해주세요.';

      Alert.alert('초대 실패', message);
    } finally {
      setSubmittingMissionId(null);
    }
  };

  const handleAdView = async (item: MissionCardItem) => {
    try {
      setSubmittingMissionId(item.id);

      const result = await missionsApi.submitMission({
        missionTitle: item.title,
        content: '광고를 시청했습니다.',
        rewardPoints: item.rewardPoints,
      });

      await fetchAdViewStatus();

      Alert.alert(
        '광고 시청 완료',
        `${result.rewardPoints.toLocaleString()} 크레딧이 지급되었습니다.`,
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        '광고 보상 지급에 실패했습니다. 다시 시도해주세요.';

      Alert.alert('광고 보기 실패', message);
      fetchAdViewStatus();
    } finally {
      setSubmittingMissionId(null);
    }
  };

  const handleMissionPress = (item: MissionCardItem) => {
    if (item.buttonText === '인증하기' || item.buttonText === '다시 인증하기') {
      navigation.navigate('MissionVerify', {
        missionTitle: item.title,
        rewardPoints: item.rewardPoints || 50,
      });
    } else if (item.buttonText === '출석하기') {
      navigation.navigate('Attendance');
    } else if (item.buttonText === '나눔 물품 등록하기') {
      navigation.navigate('ProductRegister');
    } else if (item.buttonText === '초대하기') {
      handleFriendInvite(item);
    } else if (item.buttonText === '광고보기') {
      handleAdView(item);
    }
  };

  return (
    <View
      style={[
        missionStyles.container,
        {paddingTop: insets.top, paddingBottom: insets.bottom},
      ]}>
      <View style={missionStyles.header}>
        <Text style={missionStyles.headerLogo}>EcoBid</Text>
      </View>

      <ScrollView contentContainerStyle={missionStyles.scrollContent}>
        <Text style={missionStyles.pageTitle}>미션</Text>

        <Text style={missionStyles.pageSubtitle}>
          매일 미션을 수행하고 크레딧을 모아보세요!
        </Text>

        {missionData.map(item => (
          <MissionCard
            key={item.id}
            item={item}
            isLoading={submittingMissionId === item.id}
            onPress={() => handleMissionPress(item)}
          />
        ))}

        <Text style={missionStyles.sectionTitle}>데일리 미션</Text>

        <View style={missionStyles.progressCard}>
          <View style={missionStyles.progressHeader}>
            <Text style={missionStyles.progressTitle}>오늘의 진행도</Text>
            <Text style={missionStyles.progressValue}>
              {dailyMissionsLoading
                ? '...'
                : `${earnedDailyRewardPoints}/${dailyProgress.maxRewardPoints} 크레딧`}
            </Text>
          </View>

          <View style={missionStyles.progressBarTrack}>
            <View
              style={[
                missionStyles.progressBarFill,
                {width: dailyProgressPercent},
              ]}
            />
          </View>
        </View>

        {dailyMissionsLoading ? (
          <ActivityIndicator size="small" />
        ) : dailyMissionsError ? (
          <TouchableOpacity
            style={missionStyles.button}
            activeOpacity={0.7}
            onPress={fetchDailyMissions}>
            <Text style={missionStyles.buttonText}>{dailyMissionsError}</Text>
          </TouchableOpacity>
        ) : (
          dailyMissions.map(item => (
            <MissionCard
              key={item.id}
              item={item}
              isLoading={submittingMissionId === item.id}
              onPress={() => handleMissionPress(item)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
