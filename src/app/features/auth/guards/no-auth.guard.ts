
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../../../core/enums/auth.enum';

/**
 * No Auth Guard
 * Prevents authenticated users from accessing login/register pages
 */
@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> | boolean {
    return this.authService.authStatus$.pipe(
      take(1),
      map(status => {
        if (status === AuthStatus.UNAUTHENTICATED) {
          return true;
        }
        
        // Redirect to home if already authenticated
        this.router.navigate(['/home']);
        return false;
      })
    );
  }
}
