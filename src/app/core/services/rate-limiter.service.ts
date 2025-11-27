
import { Injectable } from '@angular/core';
import { StorageUtil } from '../../shared/utils/storage.util';

interface RateLimitData {
  attempts: number;
  lastAttempt: number;
  blockedUntil?: number;
}

/**
 * Rate Limiter Service
 * Prevents brute force attacks by limiting authentication attempts
 */
@Injectable({
  providedIn: 'root'
})
export class RateLimiterService {
  private readonly MAX_ATTEMPTS = 5;
  private readonly TIME_WINDOW = 15 * 60 * 1000; // 15 minutes in milliseconds
  private readonly BLOCK_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
  private readonly STORAGE_KEY = 'radio_app_rate_limit';

  /**
   * Check if an action is allowed for a given identifier
   */
  isAllowed(identifier: string): { allowed: boolean; message?: string; remainingAttempts?: number } {
    const data = this.getRateLimitData(identifier);
    const now = Date.now();

    // Check if currently blocked
    if (data.blockedUntil && now < data.blockedUntil) {
      const remainingTime = Math.ceil((data.blockedUntil - now) / 1000 / 60);
      return {
        allowed: false,
        message: `Too many attempts. Please try again in ${remainingTime} minutes.`
      };
    }

    // Reset if time window has passed
    if (now - data.lastAttempt > this.TIME_WINDOW) {
      return {
        allowed: true,
        remainingAttempts: this.MAX_ATTEMPTS
      };
    }

    // Check if exceeded max attempts
    if (data.attempts >= this.MAX_ATTEMPTS) {
      // Block the identifier
      data.blockedUntil = now + this.BLOCK_DURATION;
      this.saveRateLimitData(identifier, data);
      
      return {
        allowed: false,
        message: `Too many failed attempts. Account temporarily locked for 30 minutes.`
      };
    }

    return {
      allowed: true,
      remainingAttempts: this.MAX_ATTEMPTS - data.attempts
    };
  }

  /**
   * Record an attempt (successful or failed)
   */
  recordAttempt(identifier: string, success: boolean): void {
    const data = this.getRateLimitData(identifier);
    const now = Date.now();

    if (success) {
      // Reset on successful attempt
      this.resetRateLimit(identifier);
    } else {
      // Increment failed attempts
      if (now - data.lastAttempt > this.TIME_WINDOW) {
        // Reset if outside time window
        data.attempts = 1;
      } else {
        data.attempts += 1;
      }
      
      data.lastAttempt = now;
      this.saveRateLimitData(identifier, data);
    }
  }

  /**
   * Reset rate limit for an identifier
   */
  resetRateLimit(identifier: string): void {
    const allData = this.getAllRateLimitData();
    delete allData[identifier];
    StorageUtil.setItem(this.STORAGE_KEY, allData);
  }

  /**
   * Get rate limit data for an identifier
   */
  private getRateLimitData(identifier: string): RateLimitData {
    const allData = this.getAllRateLimitData();
    return allData[identifier] || {
      attempts: 0,
      lastAttempt: 0
    };
  }

  /**
   * Save rate limit data for an identifier
   */
  private saveRateLimitData(identifier: string, data: RateLimitData): void {
    const allData = this.getAllRateLimitData();
    allData[identifier] = data;
    StorageUtil.setItem(this.STORAGE_KEY, allData);
  }

  /**
   * Get all rate limit data
   */
  private getAllRateLimitData(): { [key: string]: RateLimitData } {
    return StorageUtil.getItem<{ [key: string]: RateLimitData }>(this.STORAGE_KEY) || {};
  }

  /**
   * Clean up old rate limit data (call periodically)
   */
  cleanup(): void {
    const allData = this.getAllRateLimitData();
    const now = Date.now();
    const cleanedData: { [key: string]: RateLimitData } = {};

    Object.keys(allData).forEach(key => {
      const data = allData[key];
      // Keep data if it's recent or blocked
      if (
        (data.blockedUntil && now < data.blockedUntil) ||
        (now - data.lastAttempt < this.TIME_WINDOW)
      ) {
        cleanedData[key] = data;
      }
    });

    StorageUtil.setItem(this.STORAGE_KEY, cleanedData);
  }
}
