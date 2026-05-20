import apiClient from './client';

export type Badge = {
  code: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  isAwarded: boolean;
  awardedAt: string | null;
};

export const badgesApi = {
  async getMyBadges() {
    const response = await apiClient.get<{success: boolean; data: Badge[]}>(
      '/badges/my',
    );

    return response.data.data;
  },
};
