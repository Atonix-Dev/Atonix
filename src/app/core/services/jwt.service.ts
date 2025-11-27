import { Injectable } from '@angular/core';
import * as jwt from 'jsonwebtoken';

/**
 * JWT Token Payload Interface
 */
export interface TokenPayload {
  userId: string;
  username: string;
  role: 'user' | 'admin' | 'guest';
  iat?: number;
  exp?: number;
}

/**
 * Enhanced JWT Service with Real JWT Implementation
 *
 * Features:
 * - Real JWT token generation using jsonwebtoken library
 * - HS256 algorithm for signing
 * - Token verification with signature validation
 * - Automatic expiration handling (7 days)
 *
 * Note: In production, move the secret to environment variables
 * and use backend-only JWT generation
 */
@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private readonly TOKEN_EXPIRY_DAYS = 7;

  // WARNING: In production, this should be in environment variables
  // and JWT generation should ONLY happen on backend
  private readonly JWT_SECRET = 'radio-app-secret-key-change-in-production-2024';

  /**
   * Generate JWT token with signature
   * @param payload - User data to encode
   * @returns string - Signed JWT token
   */
  generateToken(payload: { userId: string; username: string; role: 'user' | 'admin' | 'guest' }): string {
    try {
      const expiresIn = `${this.TOKEN_EXPIRY_DAYS}d`;

      const token = jwt.sign(
        payload,
        this.JWT_SECRET,
        {
          algorithm: 'HS256',
          expiresIn: expiresIn,
          issuer: 'radio-app',
          audience: 'radio-app-users'
        }
      );

      return token;
    } catch (error) {
      console.error('Error generating token:', error);
      throw new Error('Failed to generate authentication token');
    }
  }

  /**
   * Verify and decode JWT token
   * @param token - JWT token to verify
   * @returns TokenPayload | null - Decoded payload if valid, null otherwise
   */
  verifyToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET, {
        algorithms: ['HS256'],
        issuer: 'radio-app',
        audience: 'radio-app-users'
      }) as TokenPayload;

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        console.warn('Token expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        console.error('Invalid token:', error.message);
      } else {
        console.error('Token verification error:', error);
      }
      return null;
    }
  }

  /**
   * Decode token without verification (use only for reading public data)
   * @param token - JWT token
   * @returns TokenPayload | null - Decoded payload without signature verification
   */
  decodeToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.decode(token) as TokenPayload;
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   * @param token - JWT token
   * @returns boolean - True if expired or invalid
   */
  isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) {
        return true;
      }

      const expirationDate = new Date(decoded.exp * 1000);
      return expirationDate < new Date();
    } catch (error) {
      return true;
    }
  }

  /**
   * Get token expiration date
   * @param token - JWT token
   * @returns Date | null - Expiration date or null if invalid
   */
  getTokenExpiration(token: string): Date | null {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) {
        return null;
      }

      return new Date(decoded.exp * 1000);
    } catch (error) {
      return null;
    }
  }

  /**
   * Get time remaining until token expiration
   * @param token - JWT token
   * @returns number - Milliseconds until expiration, 0 if expired or invalid
   */
  getTimeUntilExpiration(token: string): number {
    const expiration = this.getTokenExpiration(token);
    if (!expiration) {
      return 0;
    }

    const now = new Date();
    const timeRemaining = expiration.getTime() - now.getTime();
    return Math.max(0, timeRemaining);
  }

  /**
   * Refresh token (generate new token with same payload but new expiration)
   * @param token - Existing JWT token
   * @returns string | null - New token or null if original is invalid
   */
  refreshToken(token: string): string | null {
    const payload = this.verifyToken(token);
    if (!payload) {
      return null;
    }

    // Remove JWT standard claims before regenerating
    const { iat, exp, ...userPayload } = payload;

    return this.generateToken(userPayload as { userId: string; username: string; role: 'user' | 'admin' | 'guest' });
  }
}
