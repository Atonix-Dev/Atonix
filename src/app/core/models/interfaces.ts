export interface Station {
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  countrycode: string;
  state: string;
  language: string;
  languagecodes: string;
  votes: number;
  codec: string;
  bitrate: number;
  clickcount: number;
  clicktrend: number;
  lastchangetime: string;
  lastcheckok: number;
  lastcheckoktime: string;
}

export interface Radio extends Station {
  id: string;
  isPlaying?: boolean;
  isFavorite?: boolean;
}

export interface StationFilters {
  country?: string;
  language?: string;
  tag?: string;
  name?: string;
  limit?: number;
  offset?: number;
  order?: 'name' | 'votes' | 'clickcount' | 'bitrate';
  reverse?: boolean;
}

export interface PlayerState {
  isPlaying: boolean;
  isLoading: boolean;
  currentStation: Station | null;
  volume: number;
  isMuted: boolean;
  error: string | null;
}

export interface User {
  id: string;
  username: string;
  alias: string;
  email?: string;
  createdAt: Date;
  lastLogin?: Date;
  favorites?: string[];
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme?: 'dark' | 'light';
  language?: string;
  defaultVolume?: number;
  autoplay?: boolean;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
  error?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  alias: string;
  password: string;
  email?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface SearchResult {
  stations: Station[];
  total: number;
  query: string;
}

export interface Country {
  name: string;
  code: string;
  stationCount?: number;
}

export interface Language {
  name: string;
  code: string;
  stationCount?: number;
}

export interface Tag {
  name: string;
  stationCount?: number;
}

export interface FilterOptions {
  countries: Country[];
  languages: Language[];
  tags: Tag[];
  limits: number[];
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  message?: string;
}

export interface TokenPayload {
  userId: string;
  username: string;
  iat: number;
  exp: number;
}

export interface ErrorResponse {
  code: string;
  message: string;
  details?: unknown;
  timestamp: Date;
}

export interface VolumeChangeEvent {
  volume: number;
  isMuted: boolean;
}

export interface PlaybackEvent {
  type: 'play' | 'pause' | 'stop' | 'error' | 'loading';
  station?: Station;
  timestamp: Date;
  error?: string;
}
