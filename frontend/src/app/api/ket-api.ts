import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private baseUrl = environment.baseUrl;
  private router = inject(Router);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!request.url.startsWith('http')) {
      request = request.clone({
        url: `${this.baseUrl}${request.url}`,
      });
    }
    const token = localStorage.getItem('token');

    if (token) {
      request = request.clone({
        setHeaders: {
          "x-token": `${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          localStorage.clear();
          //   message('info', 'Sesión expirada, por favor vuelve a ingresar', 5000);
          this.router.navigate(['/']);
        }
        return throwError(() => error);
      })
    );
  }
}
