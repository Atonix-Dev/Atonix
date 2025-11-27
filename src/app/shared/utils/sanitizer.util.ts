
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

/**
 * Sanitizer Utility
 * Provides methods for sanitizing user input to prevent XSS attacks
 */
export class SanitizerUtil {
  
  /**
   * Sanitizes HTML content
   */
  static sanitizeHtml(sanitizer: DomSanitizer, html: string): SafeHtml {
    return sanitizer.sanitize(1, html) || '';
  }

  /**
   * Sanitizes URL
   */
  static sanitizeUrl(sanitizer: DomSanitizer, url: string): SafeUrl {
    return sanitizer.sanitize(4, url) || '';
  }

  /**
   * Sanitizes resource URL (for iframes, etc.)
   */
  static sanitizeResourceUrl(sanitizer: DomSanitizer, url: string): SafeResourceUrl {
    return sanitizer.sanitize(5, url) || '';
  }

  /**
   * Removes potentially dangerous characters from string
   */
  static sanitizeString(input: string): string {
    if (!input) return '';
    
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  /**
   * Validates and sanitizes email
   */
  static sanitizeEmail(email: string): string {
    if (!email) return '';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sanitized = this.sanitizeString(email);
    
    return emailRegex.test(sanitized) ? sanitized : '';
  }
}
