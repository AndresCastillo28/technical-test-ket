import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PublicGuard {
  private router = inject(Router);
  private authService = inject(AuthService);

  canActivate(): Observable<boolean> {
    return this.authService.checkAuthentication().pipe(
      tap((isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigate(['/dashboard']);
        }
      }),
      map((isAuthenticated) => !isAuthenticated)
    );
  }
}