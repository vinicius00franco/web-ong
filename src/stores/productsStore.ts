import { create } from 'zustand';
import { productsService } from '../services/products.service';
import type { Product } from '../types/product';

interface ProductsState {
  // Data
  products: Product[];
  
  // Loading states
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  reset: () => void;
}

export const useProductsStore = create<ProductsState>((set) => ({
  // Initial state
  products: [],
  loading: false,
  error: null,

  // Fetch all products
  fetchProducts: async () => {
    set({ loading: true, error: null });
    
    try {
      const response = await productsService.getProducts();
      
      // Handle both response formats: { products: [...] } or direct array
      let products: Product[] = [];
      if (Array.isArray(response)) {
        products = response;
      } else if (response && typeof response === 'object' && 'products' in response) {
        products = response.products || [];
      }
      
      set({ products, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar produtos';
      set({ error: errorMessage, loading: false, products: [] });
    }
  },

  // Add new product
  addProduct: async (productData) => {
    set({ loading: true, error: null });
    
    try {
      const newProduct = await productsService.createProduct(productData);
      set(state => ({
        products: [...state.products, newProduct],
        loading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar produto';
      set({ error: errorMessage, loading: false });
    }
  },

  // Update existing product
  updateProduct: async (id, updates) => {
    set({ loading: true, error: null });
    
    try {
      const updatedProduct = await productsService.updateProduct({ id, ...updates });
      set(state => ({
        products: state.products.map(product => 
          product.id === id ? updatedProduct : product
        ),
        loading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar produto';
      set({ error: errorMessage, loading: false });
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    
    try {
      await productsService.deleteProduct(id);
      set(state => ({
        products: state.products.filter(product => product.id !== id),
        loading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao deletar produto';
      set({ error: errorMessage, loading: false });
    }
  },

  // Reset store state
  reset: () => {
    set({
      products: [],
      loading: false,
      error: null
    });
  }
}));