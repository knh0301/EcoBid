import apiClient from './client';
import {isTestAuthEnabled} from '../auth/testAuth';

export type AttendanceRecord = {
  id: number;
  userId: number;
  attendanceDate: string;
  pointsEarned: number;
  createdAt: string;
  updatedAt: string;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export const attendanceAPI = {
  async checkIn(): Promise<{
    isAttended: boolean;
    reward: number;
    attendance: AttendanceRecord;
  }> {
    if (await isTestAuthEnabled()) {
      const today = new Date().toISOString().split('T')[0];
      const reward = Math.floor(Math.random() * 10) + 1;

      return {
        isAttended: true,
        reward,
        attendance: {
          id: 0,
          userId: 0,
          attendanceDate: today,
          pointsEarned: reward,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    }

    const response = await apiClient.post<
      ApiResponse<{
        isAttended: boolean;
        reward: number;
        attendance: AttendanceRecord;
      }>
    >('/attendance/check');

    return response.data.data;
  },

  async getTodayStatus(): Promise<{
    isAttended: boolean;
    attendance?: AttendanceRecord | null;
  }> {
    if (await isTestAuthEnabled()) {
      return {
        isAttended: false,
        attendance: null,
      };
    }

    const response = await apiClient.get<
      ApiResponse<{
        isAttended: boolean;
        attendance?: AttendanceRecord | null;
      }>
    >('/attendance/today');

    return response.data.data;
  },

  async getHistory(params?: {
    year?: number;
    month?: number;
  }): Promise<AttendanceRecord[]> {
    if (await isTestAuthEnabled()) {
      return [];
    }

    const response = await apiClient.get<ApiResponse<AttendanceRecord[]>>(
      '/attendance/history',
      {params},
    );

    return response.data.data ?? [];
  },

  async getStreak(): Promise<number> {
    if (await isTestAuthEnabled()) {
      return 0;
    }

    const response = await apiClient.get<ApiResponse<{streak: number}>>(
      '/attendance/streak',
    );

    return response.data.data.streak;
  },
};
