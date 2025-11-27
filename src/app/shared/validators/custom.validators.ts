
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Custom Form Validators
 */
export class CustomValidators {
  
  /**
   * Password strength validator
   */
  static passwordStrength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) {
        return null;
      }

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumeric = /[0-9]/.test(value);
      const hasMinLength = value.length >= 8;

      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasMinLength;

      return !passwordValid ? {
        passwordStrength: {
          hasUpperCase,
          hasLowerCase,
          hasNumeric,
          hasMinLength
        }
      } : null;
    };
  }

  /**
   * Username validator
   */
  static username(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) {
        return null;
      }

      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      const valid = usernameRegex.test(value);

      return !valid ? { invalidUsername: true } : null;
    };
  }

  /**
   * No special characters validator
   */
  static noSpecialChars(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) {
        return null;
      }

      const specialCharsRegex = /[<>{}[\]\\\/]/;
      const hasSpecialChars = specialCharsRegex.test(value);

      return hasSpecialChars ? { specialChars: true } : null;
    };
  }

  /**
   * Match fields validator (for password confirmation)
   */
  static matchFields(field1: string, field2: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value1 = control.get(field1)?.value;
      const value2 = control.get(field2)?.value;

      if (value1 && value2 && value1 !== value2) {
        control.get(field2)?.setErrors({ fieldsMismatch: true });
        return { fieldsMismatch: true };
      }

      return null;
    };
  }
}
