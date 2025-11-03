import axios from './axios';
import './axios-logger';
import type { Order, CreateOrderData } from '../types/product';
import { configManager } from '../config/app.config';
import { mockOrdersService } from '../mocks';

/**
 * Service de pedidos com suporte a dados mockados ou API real
 */
class OrdersService {
  private get useMock(): boolean {
    return configManager.getConfig().useMockData;
  }

  async getOrders(): Promise<Order[]> {
    if (this.useMock) {
      return mockOrdersService.getOrders();
    }

    const { data } = await axios.get('/api/orders');
    return data.data; // API retorna { success: true, data: Order[] }
  }

  async getOrder(id: number): Promise<Order> {
    if (this.useMock) {
      return mockOrdersService.getOrder(id);
    }

    const { data } = await axios.get(`/api/orders/${id}`);
    return data.data; // API retorna { success: true, data: Order }
  }

  async createOrder(orderData: CreateOrderData): Promise<Order> {
    if (this.useMock) {
      return mockOrdersService.createOrder(orderData);
    }

    const { data } = await axios.post('/api/orders', orderData);
    return data.data; // API retorna { success: true, data: Order }
  }
}

export const ordersService = new OrdersService();