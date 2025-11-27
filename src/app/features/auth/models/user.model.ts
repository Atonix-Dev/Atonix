
/**
 * User Model
 * Represents authenticated user data
 */
export interface User {
  id: string;
  username: string;
  email?: string;
  role: 'user' | 'admin' | 'guest';
  createdAt: Date;
  favorites?: string[];
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'auto';
  defaultCountry?: string;
  autoPlay?: boolean;
  volume?: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email?: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}
