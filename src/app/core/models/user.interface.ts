/**
 * User Model
 */
export interface User {
  id: string;
  username: string;
  role: 'user' | 'admin' | 'guest';
  createdAt: Date;
  lastLogin?: Date;
  favorites: string[];
  preferences: UserPreferences;
}

/**
 * User Preferences
 */
export interface UserPreferences {
  theme?: 'dark' | 'light';
  language?: 'es' | 'en';
  defaultCountry?: string;
  autoPlay?: boolean;
  volume?: number;
}

/**
 * Stored User (with password hash)
 * Internal model for storage only - never exposed to client
 */
export interface StoredUser {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: string;
  lastLogin?: string;
  favorites: string[];
  preferences: UserPreferences;
}

/**
 * Login Credentials
 */
export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Registration Data
 */
export interface RegisterData {
  username: string;
  password: string;
  confirmPassword: string;
  acceptTerms?: boolean;
}

/**
 * Authentication Response
 */
export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
  error?: string;
}

/**
 * Token Payload
 */
export interface TokenPayload {
  userId: string;
  username: string;
  role: 'user' | 'admin' | 'guest';
  iat?: number;
  exp?: number;
}
