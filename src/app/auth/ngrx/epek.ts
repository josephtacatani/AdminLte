import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { catchError, delay, map, mergeMap, of, switchMap, takeUntil, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AuthActions } from './login.actions';
import { ProfileActions } from 'src/app/ngrx/user_profile/user_profile.actions';

import { decodeAccessToken } from 'src/app/services/auth/auth.utils';
import { AlertActions } from 'src/app/ngrx/reusablealerts/reusablealerts.actions';
import { Store } from '@ngrx/store';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private authService: AuthService, private router: Router, private store: Store) {}

  // ✅ Handle Login Effect
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ loginRequest }) =>
        this.authService.login(loginRequest).pipe(
          mergeMap(response => {
            const expiresInMinutes = 15; // Adjust based on backend expiry time
            const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;

            sessionStorage.setItem('accessToken', response.data.accessToken);
            sessionStorage.setItem('accessTokenExpiry', expiresAt.toString());
            localStorage.setItem('refreshToken', response.data.refreshToken ?? '');

            return [
              AuthActions.loginSuccess({ loginResponse: response }),
              AlertActions.setSuccess({ message: 'Login successful!' }), // ✅ Show success alert
              ProfileActions.loadProfile() // ✅ Auto-fetch user profile after login
            ];
          }),
          catchError(error => of(
            AuthActions.loginFailure({ loginResponseError: { message: error.error.message || 'Login failed' } }),
            AlertActions.setError({ message: 'Invalid credentials. Please try again.' }) // ❌ Show error alert
          ))
        )
      )
    )
  );

  // ✅ Auto-Refresh Token Before Expiry
  autoRefreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess, AuthActions.refreshTokenSuccess),
      switchMap(() => {
        const expiresAt = Number(sessionStorage.getItem('accessTokenExpiry'));
        const now = Date.now();
        const timeUntilExpiry = expiresAt - now;
        const refreshTime = timeUntilExpiry - (30 * 1000); // 🔄 Refresh 30s before expiry

        if (timeUntilExpiry <= 0) {
          return of(AuthActions.logout({ refreshToken: localStorage.getItem('refreshToken') ?? '' }));
        }

        return of(AuthActions.refreshToken({ refreshToken: localStorage.getItem('refreshToken') ?? '' })).pipe(
          delay(refreshTime) // ⏳ Wait until 30s before token expiry
        );
      })
    )
  );

  // ✅ Handle Refresh Token Effect
  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      mergeMap(({ refreshToken }) =>
        this.authService.refreshTokenApi(refreshToken).pipe(
          mergeMap(response => {
            const expiresInMinutes = 15;
            const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;

            sessionStorage.setItem('accessToken', response.accessToken);
            sessionStorage.setItem('accessTokenExpiry', expiresAt.toString());

            return [
              AuthActions.refreshTokenSuccess({ message: 'Session extended successfully' }),
              AlertActions.setSuccess({ message: 'Session extended!' }) // ✅ Show success alert
            ];
          }),
          catchError(error => of(
            AuthActions.refreshTokenFailure({ error: error.message || 'Session refresh failed' }),
            AlertActions.setError({ message: 'Session refresh failed. Please log in again.' }) // ❌ Show error alert
          ))
        )
      )
    )
  );

  // ✅ Handle Logout Effect
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      mergeMap(({ refreshToken }) =>
        this.authService.logoutApi(refreshToken).pipe(
          mergeMap(response => {
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('userRole');
            sessionStorage.removeItem('accessTokenExpiry');
            localStorage.removeItem('refreshToken');

            this.router.navigate(['/login']); // ✅ Redirect to login page

            return [
              AuthActions.logoutSuccess({ message: response.message }),
              AlertActions.setInfo({ message: 'You have been logged out.' }) // ✅ Show info alert
            ];
          }),
          catchError(error => of(
            AuthActions.logoutFailure({ error: error.message || 'Logout failed' }),
            AlertActions.setError({ message: 'Logout failed. Try again.' }) // ❌ Show error alert
          ))
        )
      )
    )
  );

  // ✅ Auto Logout Countdown Effect
  startLogoutCountdown$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.showTokenExpiryModal),
      switchMap(() =>
        of(60).pipe(
          map((count) => count - 1), // Countdown from 60s
          delay(1000),
          takeUntil(this.actions$.pipe(ofType(AuthActions.refreshToken, AuthActions.logout))),
          tap((remaining) => {
            this.store.dispatch(AuthActions.updateLogoutCountdown({ remaining }));

            if (remaining === 30) {
              this.store.dispatch(AlertActions.setWarning({ message: 'Your session will expire in 30 seconds!' })); // ✅ 30s warning
            }
            if (remaining === 10) {
              this.store.dispatch(AlertActions.setWarning({ message: 'Your session will expire in 10 seconds!' })); // ✅ 10s warning
            }
          }),
          map((remaining) => {
            if (remaining <= 0) {
              return AuthActions.logout({ refreshToken: localStorage.getItem('refreshToken')! });
            }
            return { type: 'NO_ACTION' };
          }),
          catchError(() => of({ type: 'NO_ACTION' })) // Prevent errors from breaking effects
        )
      )
    )
  );

  autoShowTokenExpiryModal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshTokenSuccess, AuthActions.loginSuccess), // ✅ Run after login or refresh
      switchMap(() => {
        const expiresAt = Number(sessionStorage.getItem('accessTokenExpiry'));
        const now = Date.now();
        const timeUntilExpiry = expiresAt - now;
        const warningTime = 60 * 1000; // Show modal 1 minute before expiry
  
        if (timeUntilExpiry > warningTime) {
          return of(AuthActions.showTokenExpiryModal()).pipe(delay(timeUntilExpiry - warningTime));
        }
        return of(); // ✅ No action if already expired
      })
    )
  );
  

  // ✅ Auto-Clear Messages After 3s
  clearMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess, AuthActions.logoutSuccess, AuthActions.refreshTokenSuccess),
      delay(3000),
      map(() => AuthActions.clearMessage()) // ✅ Clear messages
    )
  );

  // ❌ Auto-Clear Error Messages After 3s
  clearErrors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginFailure, AuthActions.logoutFailure, AuthActions.refreshTokenFailure),
      delay(3000),
      map(() => AuthActions.clearError()) // ✅ Clear errors
    )
  );
}
