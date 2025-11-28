import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

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
 * Enhanced JWT Service with Browser-Compatible Implementation
 *
 * Features:
 * - JWT-style token generation using HMAC-SHA256
 * - Token verification with signature validation
 * - Automatic expiration handling (7 days)
 * - Browser-compatible (uses crypto-js)
 *
 * Note: This is a browser-compatible implementation. In a real production app,
 * JWT generation and verification should happen on the backend.
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
   * Generate JWT-style token with HMAC signature
   * @param payload - User data to encode
   * @returns string - Signed token
   */
  generateToken(payload: { userId: string; username: string; role: 'user' | 'admin' | 'guest' }): string {
    try {
      const now = Math.floor(Date.now() / 1000);
      const exp = now + (this.TOKEN_EXPIRY_DAYS * 24 * 60 * 60);

      const fullPayload: TokenPayload = {
        ...payload,
        iat: now,
        exp: exp
      };

      // Create JWT-like structure: header.payload.signature
      const header = { alg: 'HS256', typ: 'JWT' };
      const headerB64 = this.base64UrlEncode(JSON.stringify(header));
      const payloadB64 = this.base64UrlEncode(JSON.stringify(fullPayload));

      const signature = CryptoJS.HmacSHA256(
        `${headerB64}.${payloadB64}`,
        this.JWT_SECRET
      ).toString(CryptoJS.enc.Base64);

      const signatureB64 = this.base64UrlEncode(signature);

      return `${headerB64}.${payloadB64}.${signatureB64}`;
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
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const [headerB64, payloadB64, signatureB64] = parts;

      // Verify signature
      const expectedSignature = CryptoJS.HmacSHA256(
        `${headerB64}.${payloadB64}`,
        this.JWT_SECRET
      ).toString(CryptoJS.enc.Base64);

      const expectedSignatureB64 = this.base64UrlEncode(expectedSignature);

      if (signatureB64 !== expectedSignatureB64) {
        console.error('Invalid token signature');
        return null;
      }

      // Decode payload
      const payload = JSON.parse(this.base64UrlDecode(payloadB64)) as TokenPayload;

      // Check expiration
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        console.warn('Token expired');
        return null;
      }

      return payload;
    } catch (error) {
      console.error('Token verification error:', error);
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
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const payloadB64 = parts[1];
      const payload = JSON.parse(this.base64UrlDecode(payloadB64)) as TokenPayload;
      return payload;
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

  /**
   * Base64 URL encode
   */
  private base64UrlEncode(str: string): string {
    return str
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  /**
   * Base64 URL decode
   */
  private base64UrlDecode(str: string): string {
    // Add padding
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw new Error('Invalid base64 string');
    }

    return CryptoJS.enc.Base64.parse(output).toString(CryptoJS.enc.Utf8);
  }
}
