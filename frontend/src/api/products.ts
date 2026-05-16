import apiClient from './client';

/**
 * 상품 관련 인터페이스
 */
export interface Product {
  id: number;
  title: string;
  description: string;
  creditPrice: number;
  imageUrl?: string;
  status: 'AVAILABLE' | 'SOLD' | 'RESERVED';
  sellerId: number;
  seller?: {
    id: number;
    name: string;
    profileImage?: string;
  };
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * API 응답 공통 포맷
 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * 상품 관련 API 호출 서비스
 */
export const productsApi = {
  /**
   * 전체 상품 목록 조회 (AVAILABLE 상태만)
   */
  async getProducts(): Promise<Product[]> {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products');
    return response.data.data;
  },

  /**
   * 특정 상품 상세 조회
   * @param productId 상품 ID
   */
  async getProductById(productId: number): Promise<Product> {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${productId}`);
    return response.data.data;
  },

  /**
   * 상품 등록
   */
  async createProduct(data: {
    title: string;
    description?: string;
    creditPrice: number;
    imageUrl?: string;
    sellerId: number;
  }): Promise<Product> {
    const response = await apiClient.post<ApiResponse<Product>>('/products', data);
    return response.data.data;
  },

  /**
   * 상품 수정
   */
  async updateProduct(productId: number, data: Partial<Product>): Promise<Product> {
    const response = await apiClient.put<ApiResponse<Product>>(`/products/${productId}`, data);
    return response.data.data;
  },

  /**
   * 상품 삭제
   */
  async deleteProduct(productId: number): Promise<void> {
    await apiClient.delete(`/products/${productId}`);
  },
};
