import apiClient from './client';

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
    const response = await apiClient.get<ApiResponse<AttendanceRecord[]>>(
      '/attendance/history',
      {params},
    );

    return response.data.data ?? [];
  },

  async getStreak(): Promise<number> {
    const response = await apiClient.get<ApiResponse<{streak: number}>>(
      '/attendance/streak',
    );

    return response.data.data.streak;
  },
};
