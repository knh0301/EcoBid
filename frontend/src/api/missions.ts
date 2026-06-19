import apiClient from './client';
import {Badge} from './badges';
import {API_CONFIG} from '../config/apiConfig';

type SubmitMissionPayload = {
  missionTitle: string;
  content: string;
  imageUrl?: string | null;
  imageBase64?: string | null;
  imageMimeType?: string | null;
  rewardPoints?: number;
};

export type RecommendedMission = {
  id: string;
  title: string;
  description: string;
  desc?: string;
  rewardPoints: number;
  creditText: string;
  status: 'active' | 'completed' | 'locked' | 'pending' | 'rejected';
  buttonText: string;
  rejectionReason?: string | null;
};

export type DailyMission = RecommendedMission;

export type DailyMissionsProgress = {
  earnedRewardPoints: number;
  maxRewardPoints: number;
  completedMissionCount: number;
  pendingMissionCount?: number;
  rejectedMissionCount?: number;
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
    submission?: MissionSubmission;
    rewardPoints: number;
    requestedRewardPoints?: number;
    verification?: MissionVerificationResult | null;
    newlyAwardedBadges: Badge[];
  };
};

export type MissionSubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type MissionSubmission = {
  id: number;
  missionId: number;
  userId: number;
  content?: string | null;
  imageUrl?: string | null;
  status: MissionSubmissionStatus;
  rejectionReason?: string | null;
  verificationProvider?: string | null;
  aiIsValid?: boolean | null;
  aiConfidence?: number | null;
  aiReason?: string | null;
  aiEvidence?: string | null;
  aiCheckedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  Mission?: {
    id: number;
    title: string;
    description?: string | null;
    rewardPoints: number;
  };
  User?: {
    id: number;
    email: string;
    name: string;
    nickname?: string | null;
    studentId?: string | null;
    department?: string | null;
  };
};

export type MissionVerificationResult = {
  provider: string;
  isValid: boolean;
  confidence: number;
  reason: string;
  evidence: string[];
  checkedAt: string;
};

const getApiOrigin = () => API_CONFIG.BASE_URL.replace(/\/api\/?$/, '');

export const resolveMissionImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl) {
    return undefined;
  }

  if (
    imageUrl.startsWith('http://') ||
    imageUrl.startsWith('https://') ||
    imageUrl.startsWith('file://')
  ) {
    return imageUrl;
  }

  if (imageUrl.startsWith('/')) {
    return `${getApiOrigin()}${imageUrl}`;
  }

  return imageUrl;
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

  async getAdminMissionSubmissions(status: MissionSubmissionStatus = 'PENDING') {
    const response = await apiClient.get<{
      success: boolean;
      data: MissionSubmission[];
    }>(`/missions/admin/submissions?status=${status}`);

    return (response.data.data ?? []).map(submission => ({
      ...submission,
      imageUrl: resolveMissionImageUrl(submission.imageUrl),
    }));
  },

  async reviewMissionSubmission(
    submissionId: number,
    action: 'APPROVE' | 'REJECT',
    rejectionReason?: string,
  ) {
    const response = await apiClient.patch<SubmitMissionResponse>(
      `/missions/admin/submissions/${submissionId}`,
      {action, rejectionReason},
    );

    return response.data.data;
  },
};
