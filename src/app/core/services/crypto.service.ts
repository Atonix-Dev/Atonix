import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

/**
 * Enhanced Cryptography Service with Browser-Compatible Implementation
 *
 * Features:
 * - PBKDF2 password hashing with SHA-512 (browser-compatible alternative to BCrypt)
 * - Configurable salt rounds and iterations
 * - Secure password verification
 * - Random salt generation
 *
 * Note: This uses PBKDF2 instead of BCrypt for browser compatibility.
 * PBKDF2 with high iterations is cryptographically secure and recommended by NIST.
 */
@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  // PBKDF2 configuration (high iterations for security)
  private readonly PBKDF2_ITERATIONS = 100000; // 100,000 iterations
  private readonly HASH_SIZE = 512; // bits
  private readonly SALT_SIZE = 128; // bits

  /**
   * Hash password using PBKDF2
   * @param password - Plain text password
   * @returns Promise<string> - Hashed password with salt
   */
  async hashPassword(password: string): Promise<string> {
    try {
      // Generate random salt
      const salt = CryptoJS.lib.WordArray.random(this.SALT_SIZE / 8);

      // Hash password with PBKDF2
      const hash = CryptoJS.PBKDF2(password, salt, {
        keySize: this.HASH_SIZE / 32,
        iterations: this.PBKDF2_ITERATIONS,
        hasher: CryptoJS.algo.SHA512
      });

      // Combine salt and hash for storage
      // Format: iterations$salt$hash (compatible format)
      const saltHex = salt.toString(CryptoJS.enc.Hex);
      const hashHex = hash.toString(CryptoJS.enc.Hex);

      return `${this.PBKDF2_ITERATIONS}$${saltHex}$${hashHex}`;
    } catch (error) {
      console.error('Error hashing password:', error);
      throw new Error('Failed to hash password');
    }
  }

  /**
   * Verify password against hash
   * @param password - Plain text password to verify
   * @param hash - Stored hash to compare against
   * @returns Promise<boolean> - True if password matches
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      // Parse stored hash
      const parts = hash.split('$');
      if (parts.length !== 3) {
        console.error('Invalid hash format');
        return false;
      }

      const [iterations, saltHex, storedHashHex] = parts;
      const salt = CryptoJS.enc.Hex.parse(saltHex);

      // Hash provided password with same salt
      const computedHash = CryptoJS.PBKDF2(password, salt, {
        keySize: this.HASH_SIZE / 32,
        iterations: parseInt(iterations, 10),
        hasher: CryptoJS.algo.SHA512
      });

      const computedHashHex = computedHash.toString(CryptoJS.enc.Hex);

      // Compare hashes (constant-time comparison)
      return this.constantTimeCompare(computedHashHex, storedHashHex);
    } catch (error) {
      console.error('Error verifying password:', error);
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
   * Generate random salt
   * @returns string - Random salt in hex format
   */
  generateSalt(): string {
    const salt = CryptoJS.lib.WordArray.random(this.SALT_SIZE / 8);
    return salt.toString(CryptoJS.enc.Hex);
  }

  /**
   * Generate random token
   * @param length - Token length in bytes (default: 32)
   * @returns string - Random token in hex format
   */
  generateRandomToken(length: number = 32): string {
    const token = CryptoJS.lib.WordArray.random(length);
    return token.toString(CryptoJS.enc.Hex);
  }

  /**
   * Hash data with SHA-256
   * @param data - Data to hash
   * @returns string - SHA-256 hash in hex format
   */
  hashSHA256(data: string): string {
    return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
  }

  /**
   * Hash data with SHA-512
   * @param data - Data to hash
   * @returns string - SHA-512 hash in hex format
   */
  hashSHA512(data: string): string {
    return CryptoJS.SHA512(data).toString(CryptoJS.enc.Hex);
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
   * @returns boolean - True if strings are equal
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

  /**
   * Validate password strength
   * @param password - Password to validate
   * @returns object - Validation result with details
   */
  validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
    strength: 'weak' | 'medium' | 'strong';
  } {
    const errors: string[] = [];
    let strength: 'weak' | 'medium' | 'strong' = 'weak';

    // Minimum length check
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    // Character variety checks
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    const varietyCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChars].filter(Boolean).length;

    if (varietyCount < 3) {
      errors.push('Password must contain at least 3 of: uppercase, lowercase, numbers, special characters');
    }

    // Determine strength
    if (password.length >= 12 && varietyCount >= 3) {
      strength = 'strong';
    } else if (password.length >= 8 && varietyCount >= 2) {
      strength = 'medium';
    }

    return {
      isValid: errors.length === 0,
      errors,
      strength
    };
  }
}
