import apiClient from './client';

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
    const response = await apiClient.post<ApiResponse<ChatRoomResponse>>(
      '/chats/rooms',
      {productId},
    );

    return response.data.data;
  },
};
