import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AuthService } from './auth.service';
import { AuthActions } from 'src/app/auth/ngrx/login.actions';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenInProgress: Promise<string | null> = Promise.resolve(null); // ✅ Ensure always a Promise

  constructor(private authService: AuthService, private store: Store) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    const accessToken = sessionStorage.getItem('accessToken'); // ✅ Retrieve Access Token

    if (accessToken) {
      authReq = this.addToken(req, accessToken);
    }

    return next.handle(authReq).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // ✅ Skip refresh if this is a login request (avoid overriding login errors)
          if (req.url.includes('/auth/login')) { 
            return throwError(() => error); // ✅ Let NgRx handle the login error message
          }
          return this.handle401Error(req, next); // ✅ Only refresh if NOT a login request
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing && this.isAccessTokenExpired()) { // ✅ Only refresh if expired
      this.isRefreshing = true;
      this.refreshTokenInProgress = this.refreshAccessToken();
    }

    return from(this.refreshTokenInProgress).pipe(
      switchMap((newToken) => {
        this.isRefreshing = false;
        this.refreshTokenInProgress = Promise.resolve(null);

        if (newToken) {
          sessionStorage.setItem('accessToken', newToken);
          return next.handle(this.addToken(req, newToken));
        }

        return throwError(() => new Error('Token refresh failed')); // ✅ Do not override login errors
      }),
      catchError((error) => {
        this.isRefreshing = false;
        this.refreshTokenInProgress = Promise.resolve(null);
        return throwError(() => error); // ✅ Pass original error instead of overriding
      })
    );
  }

  private refreshAccessToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return Promise.resolve(null);

    const expiresAt = Number(sessionStorage.getItem('accessTokenExpiry'));
    const now = Date.now();

    // ✅ Refresh only if the token is actually expired (not just close to expiry)
    if (expiresAt > now) {
      return Promise.resolve(sessionStorage.getItem('accessToken'));
    }

    return new Promise((resolve, reject) => {
      this.authService.refreshTokenApi(refreshToken).subscribe({
        next: (response) => {
          sessionStorage.setItem('accessToken', response.accessToken);
          sessionStorage.setItem('accessTokenExpiry', (now + 15 * 60 * 1000).toString()); // Assume 15 min validity
          resolve(response.accessToken);
        },
        error: () => reject(null), // ✅ Avoid throwing error here
      });
    });
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private isAccessTokenExpired(): boolean {
    const expiresAt = Number(sessionStorage.getItem('accessTokenExpiry'));
    return !expiresAt || expiresAt < Date.now(); // ✅ Always returns boolean
  }
  
}
