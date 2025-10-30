/**
 * Exporta todos os serviços mockados
 */

export { mockProductsService } from './services/products.mock.service';
export { mockAuthService } from './services/auth.mock.service';
export { mockDonationsService } from './services/donations.mock.service';
export { mockOrganizationsService } from './services/organizations.mock.service';

// Imports para uso interno
import { mockProductsService } from './services/products.mock.service';
import { mockDonationsService } from './services/donations.mock.service';
import { mockOrganizationsService } from './services/organizations.mock.service';

/**
 * Função para resetar todos os mocks ao estado inicial
 */
export const resetAllMocks = (): void => {
  mockProductsService.reset();
  mockDonationsService.reset();
  mockOrganizationsService.reset();
};
