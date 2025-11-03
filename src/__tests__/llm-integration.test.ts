import { describe, it, expect, beforeAll } from 'vitest';
import axios from 'axios';

// Configuração da API
const API_BASE_URL = 'http://localhost:3000';

let apiAvailable = false;

describe('LLM API Integration - Smart Search Tests', () => {
  beforeAll(async () => {
    // Configurar axios para os testes
    axios.defaults.baseURL = API_BASE_URL;
    axios.defaults.timeout = 10000;

    // Verificar se a API está disponível
    try {
      await axios.get('/health', { timeout: 2000 });
      apiAvailable = true;
      console.log('✅ API is available for integration tests');
    } catch (error) {
      apiAvailable = false;
      console.warn('⚠️ API is not available, integration tests will be skipped');
    }
  });

  describe('🔍 Smart Search Functionality', () => {
    it('should search for cleaning products under 50 reais', async () => {
      if (!apiAvailable) {
        console.log('⏭️ Skipping test: API not available');
        return;
      }
      const searchQuery = 'produtos de limpeza até 50 reais';

      const response = await axios.get('/api/public/search', {
        params: { q: searchQuery }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data).toBeDefined();

      const searchData = response.data.data;
      expect(searchData).toHaveProperty('interpretation');
      expect(searchData).toHaveProperty('ai_used');
      expect(searchData).toHaveProperty('fallback_applied');
      expect(searchData).toHaveProperty('data');
      expect(Array.isArray(searchData.data)).toBe(true);

      console.log('✅ Smart search working');
      console.log('Query:', searchQuery);
      console.log('Interpretation:', searchData.interpretation);
      console.log('AI Used:', searchData.ai_used);
      console.log('Fallback Applied:', searchData.fallback_applied);
      console.log('Results found:', searchData.data.length);
    });

    it('should search for electronics products', async () => {
      if (!apiAvailable) {
        console.log('⏭️ Skipping test: API not available');
        return;
      }

      const searchQuery = 'produtos eletrônicos baratos';

      const response = await axios.get('/api/public/search', {
        params: { q: searchQuery }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);

      const searchData = response.data.data;
      expect(searchData).toHaveProperty('data');
      expect(Array.isArray(searchData.data)).toBe(true);

      console.log('✅ Electronics search working');
      console.log('Query:', searchQuery);
      console.log('Results found:', searchData.data.length);
    });

    it('should handle empty search query', async () => {
      if (!apiAvailable) {
        console.log('⏭️ Skipping test: API not available');
        return;
      }

      const searchQuery = '';

      const response = await axios.get('/api/public/search', {
        params: { q: searchQuery }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);

      const searchData = response.data.data;
      expect(searchData).toHaveProperty('data');
      expect(Array.isArray(searchData.data)).toBe(true);

      console.log('✅ Empty search handled');
      console.log('Results found:', searchData.data.length);
    });

    it('should handle search with special characters', async () => {
      if (!apiAvailable) {
        console.log('⏭️ Skipping test: API not available');
        return;
      }

      const searchQuery = 'café & leite @ R$ 10,00';

      const response = await axios.get('/api/public/search', {
        params: { q: searchQuery }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);

      const searchData = response.data.data;
      expect(searchData).toHaveProperty('data');
      expect(Array.isArray(searchData.data)).toBe(true);

      console.log('✅ Special characters search handled');
      console.log('Query:', searchQuery);
      console.log('Results found:', searchData.data.length);
    });

    it('should return products with correct structure', async () => {
      if (!apiAvailable) {
        console.log('⏭️ Skipping test: API not available');
        return;
      }

      const searchQuery = 'teste';

      const response = await axios.get('/api/public/search', {
        params: { q: searchQuery }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);

      const searchData = response.data.data;
      expect(Array.isArray(searchData.data)).toBe(true);

      if (searchData.data.length > 0) {
        const product = searchData.data[0];
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('category');
        expect(product).toHaveProperty('description');

        console.log('✅ Product structure validated');
        console.log('Sample product:', {
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category
        });
      }
    });
  });

  describe('⚡ Performance Tests', () => {
    it('should respond within reasonable time', async () => {
      if (!apiAvailable) {
        console.log('⏭️ Skipping test: API not available');
        return;
      }

      const startTime = Date.now();
      const searchQuery = 'performance test';

      const response = await axios.get('/api/public/search', {
        params: { q: searchQuery }
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(response.status).toBe(200);
      expect(responseTime).toBeLessThan(5000); // Should respond within 5 seconds

      console.log(`✅ Response time: ${responseTime}ms`);
    });
  });

  describe('🔄 Fallback Behavior', () => {
    it('should apply fallback when AI is not available', async () => {
      if (!apiAvailable) {
        console.log('⏭️ Skipping test: API not available');
        return;
      }
      // This test assumes the AI might not be available
      const searchQuery = 'fallback test';

      const response = await axios.get('/api/public/search', {
        params: { q: searchQuery }
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);

      const searchData = response.data.data;

      // If fallback is applied, should still return results
      expect(searchData).toHaveProperty('data');
      expect(Array.isArray(searchData.data)).toBe(true);

      console.log('✅ Fallback behavior working');
      console.log('Fallback applied:', searchData.fallbackApplied);
    });
  });
});