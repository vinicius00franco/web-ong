import type { Donation } from '../../types/entities';
import donationsData from '../data/donations.mock.json';
import { configManager } from '../../config/app.config';

const simulateDelay = (): Promise<void> => {
  const delay = configManager.getConfig().mockDelay;
  return new Promise(resolve => setTimeout(resolve, delay));
};

const generateId = (): string => {
  return `don-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

interface DonationFilters {
  status?: string;
  product_id?: string;
  page?: number;
  limit?: number;
}

interface DonationsResponse {
  donations: Donation[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class MockDonationsService {
  private donations: Donation[] = [...donationsData as Donation[]];

  async getDonations(filters: DonationFilters = {}): Promise<DonationsResponse> {
    await simulateDelay();

    let filtered = [...this.donations];

    if (filters.status) {
      filtered = filtered.filter(d => d.status === filters.status);
    }

    if (filters.product_id) {
      filtered = filtered.filter(d => d.product_id === filters.product_id);
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      donations: filtered.slice(startIndex, endIndex),
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    };
  }

  async getDonation(id: string): Promise<Donation> {
    await simulateDelay();

    const donation = this.donations.find(d => d.id === id);
    if (!donation) {
      throw new Error(`Doação com ID ${id} não encontrada`);
    }

    return donation;
  }

  async createDonation(donationData: Omit<Donation, 'id' | 'organization_id'>): Promise<Donation> {
    await simulateDelay();

    const newDonation: Donation = {
      ...donationData,
      id: generateId(),
      organization_id: 'org-001',
    };

    this.donations.push(newDonation);
    return newDonation;
  }

  async updateDonationStatus(id: string, status: Donation['status']): Promise<Donation> {
    await simulateDelay();

    const index = this.donations.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error(`Doação com ID ${id} não encontrada`);
    }

    this.donations[index] = { ...this.donations[index], status };
    return this.donations[index];
  }

  reset(): void {
    this.donations = [...donationsData as Donation[]];
  }
}

export const mockDonationsService = new MockDonationsService();
