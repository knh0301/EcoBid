import apiClient from './client';
import {Badge} from './badges';

type SubmitMissionPayload = {
  missionTitle: string;
  content: string;
  imageUrl?: string | null;
  rewardPoints?: number;
};

export type RecommendedMission = {
  id: string;
  title: string;
  description: string;
  desc?: string;
  rewardPoints: number;
  creditText: string;
  status: 'active' | 'completed' | 'locked';
  buttonText: string;
};

export type DailyMission = RecommendedMission;

export type DailyMissionsProgress = {
  earnedRewardPoints: number;
  maxRewardPoints: number;
  completedMissionCount: number;
  maxMissionCount: number;
};

export type DailyMissionsResponse = {
  missions: DailyMission[];
  progress: DailyMissionsProgress;
};

export type AdViewStatus = {
  completedCount: number;
  maxCount: number;
  remainingCount: number;
  rewardPoints: number;
  earnedRewardPoints: number;
  status: 'active' | 'locked';
  buttonText: string;
};

type SubmitMissionResponse = {
  success: boolean;
  message: string;
  data: {
    rewardPoints: number;
    newlyAwardedBadges: Badge[];
  };
};

export const missionsApi = {
  async getAdViewStatus(): Promise<AdViewStatus> {
    const response = await apiClient.get<{
      success: boolean;
      data: AdViewStatus;
    }>('/missions/ad-view/status');

    return (
      response.data.data ?? {
        completedCount: 0,
        maxCount: 3,
        remainingCount: 3,
        rewardPoints: 20,
        earnedRewardPoints: 0,
        status: 'active',
        buttonText: '광고보기',
      }
    );
  },

  async getDailyMissions(): Promise<DailyMissionsResponse> {
    const response = await apiClient.get<{
      success: boolean;
      data: DailyMissionsResponse;
    }>('/missions/daily');

    return (
      response.data.data ?? {
        missions: [],
        progress: {
          earnedRewardPoints: 0,
          maxRewardPoints: 50,
          completedMissionCount: 0,
          maxMissionCount: 5,
        },
      }
    );
  },

  async getRecommendedMissions(limit = 2): Promise<RecommendedMission[]> {
    const response = await apiClient.get<{
      success: boolean;
      data: RecommendedMission[];
    }>(`/missions/recommended?limit=${limit}`);

    return response.data.data ?? [];
  },

  async submitMission(payload: SubmitMissionPayload) {
    const response = await apiClient.post<SubmitMissionResponse>(
      '/missions/submissions',
      payload,
    );

    return response.data.data;
  },
};
