export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  // Nome da categoria (quando disponível em endpoints públicos)
  category?: string;
  categoryId: number; // Corrigido para camelCase conforme API
  imageUrl: string; // Corrigido para camelCase conforme API
  stockQty: number;
  weightGrams: number;
  organizationId: string;
  createdAt: string; // Corrigido para camelCase conforme API
  updatedAt?: string; // Corrigido para camelCase conforme API
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  categoryId: number; // Corrigido para camelCase conforme API
  imageUrl: string; // Corrigido para camelCase conforme API
  stockQty: number;
  weightGrams: number;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

export interface ProductFilters {
  categoryId?: number; // Corrigido para camelCase conforme API
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

export interface Category {
  id: number;
  name: string;
  createdAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  priceAtTime: number;
  organizationId: string;
  createdAt: string;
  product: {
    id: number;
    name: string;
    price: number;
  };
}

export interface Order {
  id: number;
  customerId?: number;
  items: OrderItem[];
  total: number;
  createdAt: string;
}

export interface CreateOrderData {
  customerId?: number;
  items: {
    productId: number;
    quantity: number;
  }[];
}

export interface OrdersResponse {
  success: boolean;
  data: Order[];
}