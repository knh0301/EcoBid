import apiClient from './client';
import {API_CONFIG} from '../config/apiConfig';

/**
 * 상품 관련 인터페이스
 */
export interface Product {
  id: number;
  title: string;
  description: string;
  category?: string | null;
  creditPrice: number;
  imageUrl?: string;
  imageUrls?: string[];
  images?: {
    id: number;
    imageUrl: string;
    sortOrder: number;
  }[];
  status: 'AVAILABLE' | 'SOLD' | 'RESERVED';
  sellerId: number;
  seller?: {
    id: number;
    name: string;
    nickname?: string | null;
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

const getApiOrigin = () => API_CONFIG.BASE_URL.replace(/\/api\/?$/, '');

export const resolveProductImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl) {
    return undefined;
  }

  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  if (imageUrl.startsWith('/')) {
    return `${getApiOrigin()}${imageUrl}`;
  }

  return imageUrl;
};

export const getProductImageUrls = (product?: Product | null) => {
  if (!product) {
    return [];
  }

  const urlsFromImages = [...(product.images ?? [])]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(image => image.imageUrl);

  const urls =
    urlsFromImages.length > 0
      ? urlsFromImages
      : product.imageUrls ?? (product.imageUrl ? [product.imageUrl] : []);

  return urls
    .map(resolveProductImageUrl)
    .filter((url): url is string => Boolean(url));
};

/**
 * 상품 관련 API 호출 서비스
 */
export const productsApi = {
  /**
   * 전체 상품 목록 조회
   */
  async getProducts(): Promise<Product[]> {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products');
    return response.data.data;
  },

  async getMyProducts(): Promise<Product[]> {
    const response = await apiClient.get<ApiResponse<Product[]>>(
      '/products/mine',
    );

    return response.data.data;
  },

  /**
   * 상품 검색 / 카테고리 필터 조회
   */
  async searchProducts(
    params: {
      search?: string;
      category?: string;
    } = {},
  ): Promise<Product[]> {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products', {
      params,
    });

    return response.data.data;
  },

  /**
   * 특정 상품 상세 조회
   * @param productId 상품 ID
   */
  async getProductById(productId: number): Promise<Product> {
    const response = await apiClient.get<ApiResponse<Product>>(
      `/products/${productId}`,
    );

    return response.data.data;
  },

  /**
   * 상품 등록
   */
  async createProduct(data: {
    title: string;
    description?: string;
    category?: string | null;
    creditPrice: number;
    imageUrl?: string;
    imageUrls?: string[];
    sellerId?: number;
  }): Promise<Product> {
    const response = await apiClient.post<ApiResponse<Product>>(
      '/products',
      data,
    );

    return response.data.data;
  },

  /**
   * 상품 수정
   */
  async updateProduct(
    productId: number,
    data: Partial<Product>,
  ): Promise<Product> {
    const response = await apiClient.put<ApiResponse<Product>>(
      `/products/${productId}`,
      data,
    );

    return response.data.data;
  },

  /**
   * 상품 삭제
   */
  async deleteProduct(productId: number): Promise<void> {
    await apiClient.delete(`/products/${productId}`);
  },

  /**
   * 상품 이미지 업로드
   */
  async uploadProductImage(data: {
    base64: string;
    mimeType: string;
  }): Promise<{imageUrl: string}> {
    const response = await apiClient.post<ApiResponse<{imageUrl: string}>>(
      '/products/images',
      data,
    );

    return response.data.data;
  },
};
