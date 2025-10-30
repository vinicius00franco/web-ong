import { describe, it, expect, beforeEach } from 'vitest';
import { configManager } from '../../config/app.config';
import { mockProductsService } from '../services/products.mock.service';
import type { CreateProductData } from '../../types/product';

describe('Mock Products Service', () => {
  beforeEach(() => {
    mockProductsService.reset();
    configManager.setMockDelay(0); // Remove delay nos testes
  });

  describe('getProducts', () => {
    it('should return all products without filters', async () => {
      const result = await mockProductsService.getProducts();
      
      expect(result.products).toBeDefined();
      expect(result.products.length).toBeGreaterThan(0);
      expect(result.total).toBeGreaterThan(0);
    });

    it('should filter products by category', async () => {
      const result = await mockProductsService.getProducts({ 
        category: 'Alimentos' 
      });
      
      result.products.forEach(product => {
        expect(product.category).toBe('Alimentos');
      });
    });

    it('should filter products by name', async () => {
      const result = await mockProductsService.getProducts({ 
        name: 'cesta' 
      });
      
      result.products.forEach(product => {
        expect(product.name.toLowerCase()).toContain('cesta');
      });
    });

    it('should paginate results correctly', async () => {
      const page1 = await mockProductsService.getProducts({ 
        page: 1, 
        limit: 5 
      });
      
      expect(page1.products.length).toBeLessThanOrEqual(5);
      expect(page1.page).toBe(1);
      expect(page1.limit).toBe(5);
      expect(page1.totalPages).toBeGreaterThan(0);
    });
  });

  describe('getProduct', () => {
    it('should return a single product by id', async () => {
      const product = await mockProductsService.getProduct('prod-001');
      
      expect(product).toBeDefined();
      expect(product.id).toBe('prod-001');
      expect(product.name).toBe('Cesta Básica Completa');
    });

    it('should throw error for non-existent product', async () => {
      await expect(
        mockProductsService.getProduct('non-existent')
      ).rejects.toThrow('não encontrado');
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const newProductData: CreateProductData = {
        name: 'Produto Teste',
        description: 'Descrição teste',
        price: 99.99,
        category: 'Teste',
        image_url: 'https://example.com/image.jpg',
        stock_qty: 10,
        weight_grams: 500,
      };

      const created = await mockProductsService.createProduct(newProductData);
      
      expect(created.id).toBeDefined();
      expect(created.name).toBe('Produto Teste');
      expect(created.price).toBe(99.99);
      expect(created.created_at).toBeDefined();
      expect(created.updated_at).toBeDefined();
    });

    it('should add product to the list', async () => {
      const initialCount = (await mockProductsService.getProducts()).total;
      
      await mockProductsService.createProduct({
        name: 'Novo Produto',
        description: 'Desc',
        price: 50,
        category: 'Teste',
        image_url: 'url',
        stock_qty: 5,
        weight_grams: 100,
      });

      const finalCount = (await mockProductsService.getProducts()).total;
      expect(finalCount).toBe(initialCount + 1);
    });
  });

  describe('updateProduct', () => {
    it('should update existing product', async () => {
      const updated = await mockProductsService.updateProduct({
        id: 'prod-001',
        price: 200,
        stock_qty: 100,
      });

      expect(updated.price).toBe(200);
      expect(updated.stock_qty).toBe(100);
      expect(updated.name).toBe('Cesta Básica Completa'); // Mantém outros campos
    });

    it('should throw error for non-existent product', async () => {
      await expect(
        mockProductsService.updateProduct({
          id: 'non-existent',
          price: 100,
        })
      ).rejects.toThrow('não encontrado');
    });

    it('should update updated_at timestamp', async () => {
      const original = await mockProductsService.getProduct('prod-001');
      const originalDate = new Date(original.updated_at);

      // Aguarda 10ms para garantir timestamp diferente
      await new Promise(resolve => setTimeout(resolve, 10));

      const updated = await mockProductsService.updateProduct({
        id: 'prod-001',
        price: 999,
      });

      const updatedDate = new Date(updated.updated_at);
      expect(updatedDate.getTime()).toBeGreaterThan(originalDate.getTime());
    });
  });

  describe('deleteProduct', () => {
    it('should delete existing product', async () => {
      await mockProductsService.deleteProduct('prod-001');
      
      await expect(
        mockProductsService.getProduct('prod-001')
      ).rejects.toThrow('não encontrado');
    });

    it('should reduce total count', async () => {
      const initialCount = (await mockProductsService.getProducts()).total;
      
      await mockProductsService.deleteProduct('prod-001');
      
      const finalCount = (await mockProductsService.getProducts()).total;
      expect(finalCount).toBe(initialCount - 1);
    });

    it('should throw error for non-existent product', async () => {
      await expect(
        mockProductsService.deleteProduct('non-existent')
      ).rejects.toThrow('não encontrado');
    });
  });

  describe('reset', () => {
    it('should reset data to initial state', async () => {
      // Modifica dados
      await mockProductsService.createProduct({
        name: 'Temp',
        description: 'Temp',
        price: 1,
        category: 'Temp',
        image_url: 'url',
        stock_qty: 1,
        weight_grams: 1,
      });

      await mockProductsService.deleteProduct('prod-001');

      // Reseta
      mockProductsService.reset();

      // Verifica se voltou ao estado inicial
      const products = await mockProductsService.getProducts();
      const product001 = await mockProductsService.getProduct('prod-001');
      
      expect(product001).toBeDefined();
      expect(products.total).toBe(12); // Número inicial de produtos
    });
  });
});
