/**
 * Generic API Response
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
  timestamp: Date;
}

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Error Response
 */
export interface ErrorResponse {
  code: string;
  message: string;
  details?: unknown;
  timestamp: Date;
  stack?: string;
}

/**
 * Rate Limit Result
 */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  message?: string;
}

/**
 * HTTP Error
 */
export interface HttpError {
  status: number;
  statusText: string;
  message: string;
  url?: string;
  error?: unknown;
}
