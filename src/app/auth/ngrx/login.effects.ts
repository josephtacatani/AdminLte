import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap, delay, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AuthActions } from './login.actions';
import { ProfileActions } from 'src/app/ngrx/user_profile/user_profile.actions';
import { Store } from '@ngrx/store';
import { LoginResponseError } from 'src/app/interfaces/auth.interfaces';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private authService: AuthService, private router: Router, private store: Store) {}

  // ✅ Handle Login Effect
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ loginRequest }) =>
        this.authService.login(loginRequest).pipe(
          map(response => {
            const expiresInMinutes = 15; // Adjust based on backend expiry time
            const expiresAt = Date.now() + expiresInMinutes * 60 * 1000; // Calculate expiration time
  
            sessionStorage.setItem('accessToken', response.data.accessToken);
            sessionStorage.setItem('accessTokenExpiry', expiresAt.toString());
            localStorage.setItem('refreshToken', response.data.refreshToken ?? '');
  
            return AuthActions.loginSuccess({ loginResponse: response });
          }),
          catchError(error => {
            const errorMessage: LoginResponseError = {
              message: error.error.message || 'Login failed' // ✅ Store as an object
            };
            return of(AuthActions.loginFailure({ loginResponseError: errorMessage }));
          })
        )
      )
    )
  );
  
  
  

  // ✅ Fetch Profile After Login Success (tap used for side-effect)
  fetchProfileAfterLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(() => this.store.dispatch(ProfileActions.loadProfile())) // ✅ Dispatch action as side effect
    ),
    { dispatch: false } // Prevents unnecessary action dispatch
  );


  handleProfileLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.loadProfileSuccess),
      tap(({ profile }) => {
        const userRole = profile.role; // ✅ Extract user role
        sessionStorage.setItem('userRole', userRole); // ✅ Store user role in sessionStorage
        if (userRole === 'patient') {
          this.router.navigate(['/patientdashboard']);
        } else if (userRole === 'dentist') {
          this.router.navigate(['/dentistdashboard']);
        }
      })
    ),
    { dispatch: false }
  );

  // ✅ Handle Logout Effect
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      exhaustMap(({ refreshToken }) =>
        this.authService.logoutApi(refreshToken).pipe(
          map(response => {
            sessionStorage.removeItem('accessToken'); // ✅ Remove access token from sessionStorage
            sessionStorage.removeItem('userRole');
            sessionStorage.removeItem('accessTokenExpiry'); // ✅ Remove token expiration time
            localStorage.removeItem('refreshToken'); // ✅ Remove refresh token from localStorage
            this.router.navigate(['/login']); // ✅ Redirect to login page after logout
            return AuthActions.logoutSuccess({ message: response.message });
          }),
          catchError(error => of(AuthActions.logoutFailure({ error: error.message || 'Logout failed' })))
        )
      )
    )
  );

  //✅ Handle Refresh Token Effect
  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      exhaustMap(({ refreshToken }) =>
        this.authService.refreshTokenApi(refreshToken).pipe(
          switchMap(response => {
            const expiresInMinutes = 15;
            const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;
  
            sessionStorage.setItem('accessToken', response.accessToken); // ✅ Update access token in sessionStorage
            sessionStorage.setItem('accessTokenExpiry', expiresAt.toString()); // ✅ Update expiration time
  
            return [
              AuthActions.refreshTokenSuccess({ message: 'Token refreshed successfully' }),
              ProfileActions.loadProfile() // ✅ Fetch user profile after refreshing token
            ];
          }),
          catchError(error => {
            console.error('Token refresh failed:', error);
            return of(AuthActions.refreshTokenFailure({ error: error.message || 'Token refresh failed' }));
          })
        )
      )
    )
  );
  

  // ✅ Automatically Refresh Token Before Expiry
  autoRefreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess, AuthActions.refreshTokenSuccess), // ✅ Run on login or refresh
      switchMap(() => {
        const expiresAt = Number(sessionStorage.getItem('accessTokenExpiry'));
        const now = Date.now();
        const timeUntilExpiry = expiresAt - now;
        const refreshTime = timeUntilExpiry - (30 * 1000); // 🔄 Refresh 30 seconds before expiry
  
        if (timeUntilExpiry <= 0) {
          return of(AuthActions.logout({ refreshToken: localStorage.getItem('refreshToken') ?? '' })); // ❌ Logout if expired
        }
  
        return of(AuthActions.refreshToken({ refreshToken: localStorage.getItem('refreshToken') ?? '' })).pipe(
          delay(refreshTime) // ⏳ Wait until 30 seconds before token expiry
        );
      })
    )
  );
  
}
