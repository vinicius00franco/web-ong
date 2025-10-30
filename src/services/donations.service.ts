import axios from 'axios';
import type { Donation } from '../types/entities';
import { configManager } from '../config/app.config';
import { mockDonationsService } from '../mocks';

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

/**
 * Service de doações com suporte a dados mockados ou API real
 */
class DonationsService {
  private get useMock(): boolean {
    return configManager.getConfig().useMockData;
  }

  async getDonations(filters: DonationFilters = {}): Promise<DonationsResponse> {
    if (this.useMock) {
      return mockDonationsService.getDonations(filters);
    }

    const { data } = await axios.get('/api/donations', { params: filters });
    return data;
  }

  async getDonation(id: string): Promise<Donation> {
    if (this.useMock) {
      return mockDonationsService.getDonation(id);
    }

    const { data } = await axios.get(`/api/donations/${id}`);
    return data;
  }

  async createDonation(donationData: Omit<Donation, 'id' | 'organization_id'>): Promise<Donation> {
    if (this.useMock) {
      return mockDonationsService.createDonation(donationData);
    }

    const { data } = await axios.post('/api/donations', donationData);
    return data;
  }

  async updateDonationStatus(id: string, status: Donation['status']): Promise<Donation> {
    if (this.useMock) {
      return mockDonationsService.updateDonationStatus(id, status);
    }

    const { data } = await axios.patch(`/api/donations/${id}/status`, { status });
    return data;
  }
}

export const donationsService = new DonationsService();
