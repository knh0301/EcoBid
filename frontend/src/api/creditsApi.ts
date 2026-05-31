import apiClient from './client';
import {authApi} from './authApi';

export type CreditReferenceType = 'ATTENDANCE' | 'MISSION' | 'PRODUCT';

export type CreditTransaction = {
  id: number;
  userId: number;
  amount: number;
  referenceType: CreditReferenceType;
  referenceId: number;
  description?: string;
  createdAt: string;
};

export type DepartmentCreditRanking = {
  rank: number;
  department: string;
  totalCredits: number;
  userCount: number;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

const calculateBalance = (transactions: CreditTransaction[]) => {
  return transactions.reduce((sum, item) => {
    return sum + Number(item.amount);
  }, 0);
};

export const creditsApi = {
  async getDepartmentCreditRankings(
    limit = 3,
  ): Promise<DepartmentCreditRanking[]> {
    const response = await apiClient.get<ApiResponse<DepartmentCreditRanking[]>>(
      `/credits/department-rankings?limit=${limit}`,
    );

    return response.data.data ?? [];
  },

  async getCreditTransactions(userId: number): Promise<CreditTransaction[]> {
    const response = await apiClient.get<ApiResponse<CreditTransaction[]>>(
      `/credits?userId=${userId}`,
    );

    return response.data.data ?? [];
  },

  async getCreditBalance(userId: number): Promise<number> {
    const transactions = await creditsApi.getCreditTransactions(userId);
    return calculateBalance(transactions);
  },

  async getMyCreditTransactions(): Promise<CreditTransaction[]> {
    const user = await authApi.getMe();
    return creditsApi.getCreditTransactions(user.id);
  },

  async getMyCreditBalance(): Promise<number> {
    const transactions = await creditsApi.getMyCreditTransactions();
    return calculateBalance(transactions);
  },
};
