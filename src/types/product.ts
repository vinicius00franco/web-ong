export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock_qty: number;
  weight_grams: number;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock_qty: number;
  weight_grams: number;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

export interface ProductFilters {
  category?: string;
  name?: string;
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}