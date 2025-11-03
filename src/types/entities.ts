export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Opcional, não retorna da API
  organization_id: string;
  role: 'admin' | 'manager' | 'volunteer';
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  cnpj: string;
  email: string;
  phone: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Donation {
  id: string;
  donor_name: string;
  donor_email: string;
  donor_phone: string;
  product_id: string;
  quantity: number;
  donation_date: string;
  status: 'pending' | 'completed' | 'cancelled';
  organization_id: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  success: boolean;
  data: {
    id: number;
    name: string;
    email: string;
  };
}
