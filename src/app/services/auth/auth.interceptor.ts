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
          return this.handle401Error(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenInProgress = this.refreshAccessToken(); // ✅ Ensure it's a valid Promise
    }

    return from(this.refreshTokenInProgress).pipe(
      switchMap((newToken) => {
        this.isRefreshing = false;
        this.refreshTokenInProgress = Promise.resolve(null); // ✅ Reset after completion

        if (newToken) {
          sessionStorage.setItem('accessToken', newToken);
          return next.handle(this.addToken(req, newToken));
        }

        return throwError(() => new Error('Token refresh failed'));
      }),
      catchError(() => {
        this.isRefreshing = false;
        this.refreshTokenInProgress = Promise.resolve(null);
        return throwError(() => new Error('Token refresh failed'));
      })
    );
  }

  private refreshAccessToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return Promise.resolve(null);
  
    // Get access token expiry (store this when the user logs in)
    const expiresAt = Number(sessionStorage.getItem('accessTokenExpiry')); 
    const now = Date.now();
  
    // Refresh if the token is expiring in less than 30 seconds
    if (expiresAt - now > 30 * 1000) {
      return Promise.resolve(sessionStorage.getItem('accessToken'));
    }
  
    return new Promise((resolve, reject) => {
      this.authService.refreshTokenApi(refreshToken).subscribe({
        next: (response) => {
          sessionStorage.setItem('accessToken', response.accessToken);
          sessionStorage.setItem('accessTokenExpiry', (now + 15 * 60 * 1000).toString()); // Assume 15 min validity
          resolve(response.accessToken);
        },
        error: () => reject(null),
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
}
