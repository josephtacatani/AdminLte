import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from, timer } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AuthService } from './auth.service';
import { AuthActions } from 'src/app/auth/ngrx/login.actions';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenInProgress: Promise<string | null> = Promise.resolve(null);
  private countdownStarted = false;

  constructor(private authService: AuthService, private store: Store, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    const accessToken = sessionStorage.getItem('accessToken');

    if (accessToken) {
      authReq = this.addToken(req, accessToken);
      this.monitorTokenExpiry(); // ✅ Start monitoring token expiry
    }

    return next.handle(authReq).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          if (req.url.includes('/auth/login')) {
            return throwError(() => error);
          }
          return this.handle401Error(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private monitorTokenExpiry(): void {
    if (this.countdownStarted) return;
    this.countdownStarted = true;
  
    const expiresAt = Number(sessionStorage.getItem('accessTokenExpiry'));
    const now = Date.now();
    const timeUntilExpiry = expiresAt - now;
    const warningTime = 60 * 1000; // Show modal 1 minute before expiry
  
    if (timeUntilExpiry > warningTime) {
      timer(timeUntilExpiry - warningTime).subscribe(() => {
        this.store.dispatch(AuthActions.showTokenExpiryModal());
      });
    }
  }
  

  private startLogoutCountdown(seconds: number): void {
    let remaining = seconds;
    const interval = setInterval(() => {
      this.store.dispatch(AuthActions.updateLogoutCountdown({ remaining }));

      if (remaining <= 0) {
        clearInterval(interval);
        this.store.dispatch(AuthActions.logout({ refreshToken: localStorage.getItem('refreshToken')! }));
        sessionStorage.clear();
        localStorage.clear();
        this.router.navigate(['/auth/login']);
      }
      remaining--;
    }, 1000);
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing && this.isAccessTokenExpired()) {
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

        return throwError(() => new Error('Token refresh failed'));
      }),
      catchError((error) => {
        this.isRefreshing = false;
        this.refreshTokenInProgress = Promise.resolve(null);
        return throwError(() => error);
      })
    );
  }

  private refreshAccessToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return Promise.resolve(null);

    return new Promise((resolve, reject) => {
      this.authService.refreshTokenApi(refreshToken).subscribe({
        next: (response) => {
          sessionStorage.setItem('accessToken', response.accessToken);
          sessionStorage.setItem('accessTokenExpiry', (Date.now() + 15 * 60 * 1000).toString());
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

  private isAccessTokenExpired(): boolean {
    const expiresAt = Number(sessionStorage.getItem('accessTokenExpiry'));
    return !expiresAt || expiresAt < Date.now();
  }

  
}
