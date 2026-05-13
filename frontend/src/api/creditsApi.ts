import apiClient from './client';

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

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export const creditsApi = {
  async getCreditTransactions(userId: number): Promise<CreditTransaction[]> {
    const response = await apiClient.get<ApiResponse<CreditTransaction[]>>(
      `/credits?userId=${userId}`,
    );

    return response.data.data;
  },

  async getCreditBalance(userId: number): Promise<number> {
  const transactions = await this.getCreditTransactions(userId);

  console.log('credit transactions:', transactions);

  const balance = transactions.reduce((sum, item) => {
    return sum + item.amount;
  }, 0);

  console.log('calculated balance:', balance);

  return balance;
},
};