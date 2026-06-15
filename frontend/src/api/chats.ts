import apiClient from './client';
import {isTestAuthEnabled} from '../auth/testAuth';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type ChatRoomResponse = {
  id: number;
  productId: number;
  buyerId: number;
  sellerId: number;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  creditTransferAmount?: number | null;
  creditTransferredAt?: string | null;
  completedAt?: string | null;
  product?: {
    id: number;
    title: string;
    creditPrice: number;
    imageUrl?: string | null;
  };
  buyer?: {
    id: number;
    name: string;
    nickname?: string | null;
    profileImage?: string | null;
  };
  seller?: {
    id: number;
    name: string;
    nickname?: string | null;
    profileImage?: string | null;
  };
};

export const chatsApi = {
  async createOrGetRoom(productId: number): Promise<ChatRoomResponse> {
    if (await isTestAuthEnabled()) {
      throw new Error('테스트 모드에서는 채팅방을 만들 수 없습니다.');
    }

    const response = await apiClient.post<ApiResponse<ChatRoomResponse>>(
      '/chats/rooms',
      {productId},
    );

    return response.data.data;
  },
};
