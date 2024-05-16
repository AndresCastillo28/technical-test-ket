import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SignUpInterface } from '../interfaces/signup-request.interface';
import { Observable, catchError, map, of } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response.interface';
import { UserInterface } from '../interfaces/user.interface';
import { LoginRequestInterface } from '../interfaces/login-request.interface';
import { LoginResponseInterface } from '../interfaces/login-response.interface';
import { Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { AuthenticatedUserInterface } from '../interfaces/authenticated-user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = '/auth';
  private route = inject(Router);
  private snackbarService = inject(SnackbarService);
  private currentUser!: AuthenticatedUserInterface | undefined;

  signIn(
    data: LoginRequestInterface
  ): Observable<ApiResponse<LoginResponseInterface>> {
    return this.http.post<ApiResponse<LoginResponseInterface>>(
      `${this.baseUrl}/signin`,
      data
    );
  }

  getCurrentUser(): AuthenticatedUserInterface | undefined {
    return this.currentUser;
  }

  setCurrentUser(user: AuthenticatedUserInterface | undefined): void {
    this.currentUser = user;
  }

  signup(data: SignUpInterface): Observable<ApiResponse<UserInterface>> {
    return this.http.post<ApiResponse<UserInterface>>(
      `${this.baseUrl}/signup`,
      data
    );
  }

  logout(): void {
    localStorage.clear();
    this.setCurrentUser(undefined);
    this.route.navigate(['/']);
    this.snackbarService.openSnackBar('Session closed succesfully.');
  }

  checkAuthentication(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of(false);
    }
    return this.http
      .get<ApiResponse<LoginResponseInterface>>(`${this.baseUrl}/renew`)
      .pipe(
        map((response: ApiResponse<LoginResponseInterface>) => {
          if (response.data) {
            const data = {
              id: response.data.id,
              name: response.data.name,
              role: response.data.role,
            };
            this.setCurrentUser(data);
            localStorage.setItem('token', response.data.token);
            return true;
          }
          return false;
        }),
        catchError((error) => {
          if (error.status === 401) {
            return of(false);
          }

          return of(false);
        })
      );
  }
}
