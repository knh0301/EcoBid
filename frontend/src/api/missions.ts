import apiClient from './client';
import {Badge} from './badges';

type SubmitMissionPayload = {
  missionTitle: string;
  content: string;
  imageUrl?: string | null;
  rewardPoints?: number;
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
  async submitMission(payload: SubmitMissionPayload) {
    const response = await apiClient.post<SubmitMissionResponse>(
      '/missions/submissions',
      payload,
    );

    return response.data.data;
  },
};
