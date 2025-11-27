import { Injectable } from '@angular/core';
import * as bcrypt from 'bcryptjs';

/**
 * Enhanced Cryptography Service with Real BCrypt Implementation
 *
 * Features:
 * - BCrypt password hashing with 12 salt rounds
 * - Secure token generation using Web Crypto API
 * - Constant-time comparison to prevent timing attacks
 * - Unique user ID generation
 */
@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private readonly SALT_ROUNDS = 12;

  /**
   * Hash password using BCrypt with 12 salt rounds
   * @param password - Plain text password
   * @returns Promise<string> - BCrypt hash
   */
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Verify password against BCrypt hash
   * @param password - Plain text password
   * @param storedHash - BCrypt hash from storage
   * @returns Promise<boolean> - True if password matches
   */
  async verifyPassword(password: string, storedHash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, storedHash);
    } catch (error) {
      console.error('Password verification error:', error);
      return false;
    }
  }

  /**
   * Generate cryptographically secure random token
   * @returns string - 64-character hex token
   */
  generateSecureToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generate unique user ID with timestamp and random components
   * @param alias - User alias
   * @returns string - Unique user ID (format: usr_{timestamp}_{aliasHash}_{random})
   */
  generateUserId(alias: string): string {
    const timestamp = Date.now().toString(36);
    const randomPart = this.generateSecureToken().substring(0, 12);
    const aliasHash = this.hashAlias(alias);
    return `usr_${timestamp}_${aliasHash}_${randomPart}`;
  }

  /**
   * Create deterministic hash from alias (for ID generation only)
   * NOT cryptographically secure - only for user ID component
   * @param alias - User alias
   * @returns string - Base36 hash
   */
  private hashAlias(alias: string): string {
    let hash = 0;
    for (let i = 0; i < alias.length; i++) {
      const char = alias.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Constant-time string comparison to prevent timing attacks
   * @param a - First string
   * @param b - Second string
   * @returns boolean - True if strings match
   */
  private constantTimeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }
}
