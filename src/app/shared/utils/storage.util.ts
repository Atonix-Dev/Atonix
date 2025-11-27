import * as CryptoJS from 'crypto-js';

/**
 * Enhanced Secure Storage Utility with Real Encryption
 *
 * Features:
 * - AES-256 encryption for sensitive data
 * - Type-safe generic methods
 * - Automatic JSON serialization/deserialization
 * - Error handling
 *
 * Note: In production, use environment-specific encryption keys
 */
export class StorageUtil {
  // WARNING: In production, this should come from environment variables
  private static readonly ENCRYPTION_KEY = 'radio-app-encryption-key-2024-change-in-production';

  /**
   * Store item in localStorage with AES encryption
   * @param key - Storage key
   * @param value - Value to store (will be JSON stringified)
   */
  static setItem<T>(key: string, value: T): void {
    try {
      const stringValue = JSON.stringify(value);
      const encrypted = CryptoJS.AES.encrypt(stringValue, this.ENCRYPTION_KEY).toString();
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Error storing item:', error);
      throw new Error(`Failed to store item with key: ${key}`);
    }
  }

  /**
   * Retrieve and decrypt item from localStorage
   * @param key - Storage key
   * @returns T | null - Decrypted and parsed value or null if not found
   */
  static getItem<T>(key: string): T | null {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) {
        return null;
      }

      const decrypted = CryptoJS.AES.decrypt(encrypted, this.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);

      if (!decrypted) {
        console.warn(`Failed to decrypt item with key: ${key}`);
        return null;
      }

      return JSON.parse(decrypted) as T;
    } catch (error) {
      console.error('Error retrieving item:', error);
      // If decryption fails, item might be corrupted or use old encryption
      // Remove it to prevent future errors
      this.removeItem(key);
      return null;
    }
  }

  /**
   * Remove item from localStorage
   * @param key - Storage key
   */
  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }

  /**
   * Clear all items from localStorage
   */
  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  /**
   * Check if key exists in localStorage
   * @param key - Storage key
   * @returns boolean - True if key exists
   */
  static hasItem(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Get all keys in localStorage
   * @returns string[] - Array of all storage keys
   */
  static getAllKeys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        keys.push(key);
      }
    }
    return keys;
  }

  /**
   * Store item in sessionStorage with encryption (cleared on tab close)
   * @param key - Storage key
   * @param value - Value to store
   */
  static setSessionItem<T>(key: string, value: T): void {
    try {
      const stringValue = JSON.stringify(value);
      const encrypted = CryptoJS.AES.encrypt(stringValue, this.ENCRYPTION_KEY).toString();
      sessionStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Error storing session item:', error);
      throw new Error(`Failed to store session item with key: ${key}`);
    }
  }

  /**
   * Retrieve item from sessionStorage
   * @param key - Storage key
   * @returns T | null - Decrypted value or null
   */
  static getSessionItem<T>(key: string): T | null {
    try {
      const encrypted = sessionStorage.getItem(key);
      if (!encrypted) {
        return null;
      }

      const decrypted = CryptoJS.AES.decrypt(encrypted, this.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);

      if (!decrypted) {
        return null;
      }

      return JSON.parse(decrypted) as T;
    } catch (error) {
      console.error('Error retrieving session item:', error);
      sessionStorage.removeItem(key);
      return null;
    }
  }

  /**
   * Remove item from sessionStorage
   * @param key - Storage key
   */
  static removeSessionItem(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing session item:', error);
    }
  }

  /**
   * Get storage size in bytes (approximate)
   * @returns number - Approximate size in bytes
   */
  static getStorageSize(): number {
    let size = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          size += key.length + value.length;
        }
      }
    }
    return size * 2; // Each character is 2 bytes in UTF-16
  }

  /**
   * Migrate old unencrypted data to encrypted format
   * @param key - Storage key
   */
  static migrateToEncrypted(key: string): void {
    try {
      const oldValue = localStorage.getItem(key);
      if (!oldValue) {
        return;
      }

      // Try to parse as JSON (unencrypted)
      try {
        const parsed = JSON.parse(oldValue);
        // If successful, re-save with encryption
        this.setItem(key, parsed);
        console.log(`Migrated ${key} to encrypted storage`);
      } catch {
        // Already encrypted or invalid, skip
      }
    } catch (error) {
      console.error('Error migrating data:', error);
    }
  }
}
