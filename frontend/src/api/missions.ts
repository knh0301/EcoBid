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
  status: 'active' | 'completed';
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
