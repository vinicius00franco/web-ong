import type { Organization } from '../../types/entities';
import organizationsData from '../data/organizations.mock.json';
import { configManager } from '../../config/app.config';

const simulateDelay = (): Promise<void> => {
  const delay = configManager.getConfig().mockDelay;
  return new Promise(resolve => setTimeout(resolve, delay));
};

class MockOrganizationsService {
  private organizations: Organization[] = [...organizationsData];

  async getOrganization(id: string): Promise<Organization> {
    await simulateDelay();

    const org = this.organizations.find(o => o.id === id);
    if (!org) {
      throw new Error(`Organização com ID ${id} não encontrada`);
    }

    return org;
  }

  async getCurrentOrganization(): Promise<Organization> {
    await simulateDelay();
    // Retorna a primeira organização como padrão
    return this.organizations[0];
  }

  async updateOrganization(id: string, data: Partial<Organization>): Promise<Organization> {
    await simulateDelay();

    const index = this.organizations.findIndex(o => o.id === id);
    if (index === -1) {
      throw new Error(`Organização com ID ${id} não encontrada`);
    }

    this.organizations[index] = {
      ...this.organizations[index],
      ...data,
      updated_at: new Date().toISOString(),
    };

    return this.organizations[index];
  }

  reset(): void {
    this.organizations = [...organizationsData];
  }
}

export const mockOrganizationsService = new MockOrganizationsService();
