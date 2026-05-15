import apiClient from './client';
import {Product} from './products';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

type FavoriteState = {
  productId: number;
  isLiked: boolean;
};

export const favoritesApi = {
  async getFavorites(): Promise<Product[]> {
    const response = await apiClient.get<ApiResponse<Product[]>>('/favorites');
    return response.data.data ?? [];
  },

  async getFavoriteIds(): Promise<number[]> {
    const response = await apiClient.get<ApiResponse<number[]>>('/favorites/ids');
    return response.data.data ?? [];
  },

  async addFavorite(productId: number): Promise<FavoriteState> {
    const response = await apiClient.post<ApiResponse<FavoriteState>>(
      `/favorites/${productId}`,
    );
    return response.data.data;
  },

  async removeFavorite(productId: number): Promise<FavoriteState> {
    const response = await apiClient.delete<ApiResponse<FavoriteState>>(
      `/favorites/${productId}`,
    );
    return response.data.data;
  },

  async setFavorite(
    productId: number,
    shouldLike: boolean,
  ): Promise<FavoriteState> {
    return shouldLike
      ? favoritesApi.addFavorite(productId)
      : favoritesApi.removeFavorite(productId);
  },
};
