export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: number; // Alterado de category: string para category_id: number
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
  category_id: number; // Alterado de category: string para category_id: number
  image_url: string;
  stock_qty: number;
  weight_grams: number;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

export interface ProductFilters {
  category_id?: number; // Alterado de category?: string para category_id?: number
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