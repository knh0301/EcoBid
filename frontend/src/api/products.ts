import apiClient from './client';

/**
 * 상품 관련 인터페이스 (예시)
 */
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  category: string;
  createdAt: string;
}

/**
 * 상품 관련 API 호출 서비스
 */
export const productsApi = {
  /**
   * 전체 상품 목록 조회
   */
  async getProducts(): Promise<Product[]> {
    const response = await apiClient.get<Product[]>('/products');
    return response.data;
  },

  /**
   * 특정 상품 상세 조회
   * @param productId 상품 ID
   */
  async getProductById(productId: number): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${productId}`);
    return response.data;
  },

  /**
   * 카테고리별 상품 조회 (추가 예시)
   * @param category 카테고리 이름
   */
  async getProductsByCategory(category: string): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(`/products`, {
      params: { category },
    });
    return response.data;
  },
};
