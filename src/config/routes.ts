/**
 * Constantes centralizadas para todas as rotas da aplicação
 * Facilita manutenção e evita rotas hardcoded espalhadas pelo código
 */

export const ROUTES = {
  // Rotas públicas
  HOME: '/',
  ABOUT: '/about',
  LOGIN: '/login',

  // Rotas da ONG (protegidas)
  ONG: {
    ROOT: '/ong',
    DASHBOARD: '/ong',
    PRODUCTS: '/ong/products',
    PRODUCTS_NEW: '/ong/products/new',
    PRODUCTS_EDIT: (id: string | number) => `/ong/products/${id}/edit`,
  },

  // Utilitários para construção de rotas dinâmicas
  buildProductEdit: (id: string | number): string => `/ong/products/${id}/edit`,
} as const;

/**
 * Tipos para as rotas
 */
export type PublicRoutes = typeof ROUTES.HOME | typeof ROUTES.ABOUT | typeof ROUTES.LOGIN;
export type OngRoutes = typeof ROUTES.ONG[keyof typeof ROUTES.ONG] | string; // string para rotas dinâmicas