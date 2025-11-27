import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { CustomValidators } from '../../../../shared/validators/custom.validators';

/**
 * Register Component
 * Handles user registration with proper memory management
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        CustomValidators.username()
      ]],
      email: ['', [Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        CustomValidators.passwordStrength()
      ]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, {
      validators: CustomValidators.matchFields('password', 'confirmPassword')
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Handle registration form submission
   */
  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { username, email, password, confirmPassword } = this.registerForm.value;

    this.authService.register({ username, email, password, confirmPassword })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/home']);
          } else {
            this.errorMessage = response.message || 'Error al registrarse';
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Error al conectar con el servidor';
          this.isLoading = false;
          console.error('Registration error:', error);
        }
      });
  }

  /**
   * Toggle password field visibility
   */
  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  /**
   * Navigate to login page
   */
  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  /**
   * Mark all form controls as touched
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Check if field has specific error
   */
  hasError(field: string, error: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control?.hasError(error) && control?.touched);
  }

  /**
   * Get password strength validation errors as readable messages
   */
  getPasswordStrengthErrors(): string[] {
    const errors = this.registerForm.get('password')?.errors;
    if (!errors || !errors['passwordStrength']) return [];

    const strength = errors['passwordStrength'];
    const messages: string[] = [];

    if (!strength.hasMinLength) messages.push('Mínimo 8 caracteres');
    if (!strength.hasUpperCase) messages.push('Una letra mayúscula');
    if (!strength.hasLowerCase) messages.push('Una letra minúscula');
    if (!strength.hasNumeric) messages.push('Un número');

    return messages;
  }
}
