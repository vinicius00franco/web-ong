import type { Order, CreateOrderData } from '../../types/product';

const ordersData: Order[] = [
  {
    id: 1,
    customerId: 123,
    items: [
      {
        id: 1,
        orderId: 1,
        productId: 456,
        quantity: 5,
        priceAtTime: 10.99,
        organizationId: 'org-123',
        createdAt: '2025-11-03T00:00:00.000Z',
        product: {
          id: 456,
          name: 'Produto Exemplo',
          price: 10.99
        }
      }
    ],
    total: 54.95,
    createdAt: '2025-11-03T00:00:00.000Z'
  }
];

class MockOrdersService {
  private orders = [...ordersData];

  async getOrders(): Promise<Order[]> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.orders];
  }

  async getOrder(id: number): Promise<Order> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 300));
    const order = this.orders.find(o => o.id === id);
    if (!order) {
      throw new Error('Order not found');
    }
    return { ...order };
  }

  async createOrder(orderData: CreateOrderData): Promise<Order> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 300));
    const newOrder: Order = {
      id: Date.now(),
      customerId: orderData.customerId,
      items: orderData.items.map((item, index) => ({
        id: Date.now() + index,
        orderId: Date.now(),
        productId: item.productId,
        quantity: item.quantity,
        priceAtTime: 10.99, // Mock price
        organizationId: 'org-mock',
        createdAt: new Date().toISOString(),
        product: {
          id: item.productId,
          name: `Produto ${item.productId}`,
          price: 10.99
        }
      })),
      total: orderData.items.reduce((sum, item) => sum + (item.quantity * 10.99), 0),
      createdAt: new Date().toISOString()
    };

    this.orders.push(newOrder);
    return { ...newOrder };
  }
}

export const mockOrdersService = new MockOrdersService();