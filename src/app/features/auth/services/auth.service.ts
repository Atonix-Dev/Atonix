
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, from } from 'rxjs';
import { delay, tap, catchError, switchMap } from 'rxjs/operators';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../models/user.model';
import { AuthStatus } from '../../../core/enums/auth.enum';
import { StorageUtil } from '../../../shared/utils/storage.util';
import { STORAGE_KEYS } from '../../../core/constants/api.constants';
import { ValidatorUtil } from '../../../shared/utils/validator.util';
import { SanitizerUtil } from '../../../shared/utils/sanitizer.util';
import { CryptoService } from '../../../core/services/crypto.service';
import { JwtService } from '../../../core/services/jwt.service';
import { RateLimiterService } from '../../../core/services/rate-limiter.service';

/**
 * Enhanced Authentication Service
 * Implements secure authentication with:
 * - Alias-only registration (no email or personal data required)
 * - BCrypt password hashing
 * - JWT token generation
 * - Rate limiting to prevent brute force attacks
 * - Secure session management
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject$ = new BehaviorSubject<User | null>(null);
  private authStatusSubject$ = new BehaviorSubject<AuthStatus>(AuthStatus.CHECKING);

  public currentUser$ = this.currentUserSubject$.asObservable();
  public authStatus$ = this.authStatusSubject$.asObservable();

  constructor(
    private cryptoService: CryptoService,
    private jwtService: JwtService,
    private rateLimiterService: RateLimiterService
  ) {
    this.checkAuthStatus();
    // Cleanup old rate limit data on initialization
    this.rateLimiterService.cleanup();
  }

  /**
   * Check authentication status on initialization
   */
  private checkAuthStatus(): void {
    const user = StorageUtil.getItem<User>(STORAGE_KEYS.USER_DATA);
    const token = StorageUtil.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);

    if (user && token && !this.jwtService.isTokenExpired(token)) {
      this.currentUserSubject$.next(user);
      this.authStatusSubject$.next(AuthStatus.AUTHENTICATED);
    } else {
      // Clear invalid session
      if (token && this.jwtService.isTokenExpired(token)) {
        this.logout();
      }
      this.authStatusSubject$.next(AuthStatus.UNAUTHENTICATED);
    }
  }

  /**
   * Login user with enhanced security
   * - Rate limiting
   * - Password verification with bcrypt
   * - JWT token generation
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    // Sanitize inputs
    const alias = SanitizerUtil.sanitizeString(credentials.username);
    const password = credentials.password;

    // Validate inputs
    if (!ValidatorUtil.isValidUsername(alias)) {
      return of({ 
        success: false, 
        message: 'AUTH.MESSAGES.INVALID_CREDENTIALS'
      });
    }

    // Check rate limiting
    const rateLimitCheck = this.rateLimiterService.isAllowed(alias);
    if (!rateLimitCheck.allowed) {
      return of({
        success: false,
        message: rateLimitCheck.message || 'Too many attempts. Please try again later.'
      });
    }

    // Perform login
    return from(this.performSecureLogin(alias, password)).pipe(
      delay(500), // Simulate network delay
      tap(response => {
        // Record attempt for rate limiting
        this.rateLimiterService.recordAttempt(alias, response.success);
        
        if (response.success && response.user && response.token) {
          this.setSession(response.user, response.token);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return of({
          success: false,
          message: 'An error occurred during login'
        });
      })
    );
  }

  /**
   * Register new user with alias only
   * - No email or personal data required
   * - BCrypt password hashing
   * - Unique ID generation
   * - JWT token generation
   */
  register(data: RegisterData): Observable<AuthResponse> {
    // Sanitize inputs
    const alias = SanitizerUtil.sanitizeString(data.username);

    // Validate inputs
    if (!ValidatorUtil.isValidUsername(alias)) {
      return of({ 
        success: false, 
        message: 'AUTH.REGISTER.ERROR_ALIAS_INVALID'
      });
    }

    if (!ValidatorUtil.isValidPassword(data.password)) {
      return of({ 
        success: false, 
        message: 'AUTH.REGISTER.ERROR_PASSWORD_STRENGTH'
      });
    }

    if (data.password !== data.confirmPassword) {
      return of({ 
        success: false, 
        message: 'AUTH.REGISTER.ERROR_PASSWORD_MISMATCH'
      });
    }

    // Check rate limiting for registration
    const rateLimitCheck = this.rateLimiterService.isAllowed(`reg_${alias}`);
    if (!rateLimitCheck.allowed) {
      return of({
        success: false,
        message: rateLimitCheck.message || 'Too many registration attempts'
      });
    }

    // Perform registration
    return from(this.performSecureRegistration(alias, data.password)).pipe(
      delay(500),
      tap(response => {
        this.rateLimiterService.recordAttempt(`reg_${alias}`, response.success);
        
        if (response.success && response.user && response.token) {
          this.setSession(response.user, response.token);
        }
      }),
      catchError(error => {
        console.error('Registration error:', error);
        return of({
          success: false,
          message: 'An error occurred during registration'
        });
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    StorageUtil.removeItem(STORAGE_KEYS.USER_DATA);
    StorageUtil.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    this.currentUserSubject$.next(null);
    this.authStatusSubject$.next(AuthStatus.UNAUTHENTICATED);
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject$.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.authStatusSubject$.value === AuthStatus.AUTHENTICATED;
  }

  /**
   * Set user session
   */
  private setSession(user: User, token: string): void {
    StorageUtil.setItem(STORAGE_KEYS.USER_DATA, user);
    StorageUtil.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    this.currentUserSubject$.next(user);
    this.authStatusSubject$.next(AuthStatus.AUTHENTICATED);
  }

  /**
   * Perform secure login with bcrypt password verification
   */
  private async performSecureLogin(alias: string, password: string): Promise<AuthResponse> {
    const storedUsers = StorageUtil.getItem<any[]>('radio_app_users') || [];
    const user = storedUsers.find((u: any) => u.username === alias);

    if (!user) {
      return {
        success: false,
        message: 'AUTH.MESSAGES.INVALID_CREDENTIALS'
      };
    }

    // Verify password with bcrypt
    const isPasswordValid = await this.cryptoService.verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      return {
        success: false,
        message: 'AUTH.MESSAGES.INVALID_CREDENTIALS'
      };
    }

    // Create auth user object
    const authUser: User = {
      id: user.id,
      username: user.username,
      role: 'user',
      createdAt: new Date(user.createdAt),
      favorites: user.favorites || [],
      preferences: user.preferences || {}
    };

    // Generate JWT token
    const token = this.jwtService.generateToken({
      userId: authUser.id,
      username: authUser.username,
      role: authUser.role
    });

    return {
      success: true,
      user: authUser,
      token,
      message: 'AUTH.MESSAGES.LOGIN_SUCCESS'
    };
  }

  /**
   * Perform secure registration with bcrypt hashing
   */
  private async performSecureRegistration(alias: string, password: string): Promise<AuthResponse> {
    const storedUsers = StorageUtil.getItem<any[]>('radio_app_users') || [];
    
    // Check if alias already exists
    if (storedUsers.some((u: any) => u.username === alias)) {
      return {
        success: false,
        message: 'AUTH.MESSAGES.ALIAS_TAKEN'
      };
    }

    // Generate unique user ID
    const userId = this.cryptoService.generateUserId(alias);

    // Hash password with bcrypt
    const passwordHash = await this.cryptoService.hashPassword(password);

    // Create new user
    const newUser: User = {
      id: userId,
      username: alias,
      role: 'user',
      createdAt: new Date(),
      favorites: [],
      preferences: {
        theme: 'light',
        defaultCountry: 'US',
        autoPlay: false,
        volume: 0.7
      }
    };

    // Store user with hashed password
    storedUsers.push({
      id: userId,
      username: alias,
      passwordHash,
      createdAt: newUser.createdAt.toISOString(),
      favorites: newUser.favorites,
      preferences: newUser.preferences
    });
    
    StorageUtil.setItem('radio_app_users', storedUsers);

    // Generate JWT token
    const token = this.jwtService.generateToken({
      userId: newUser.id,
      username: newUser.username,
      role: newUser.role
    });

    return {
      success: true,
      user: newUser,
      token,
      message: 'AUTH.MESSAGES.REGISTER_SUCCESS'
    };
  }
}
