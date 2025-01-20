import { Store } from '@ngrx/store';
import { AuthActions } from '../auth/ngrx/login.actions';
import { Router } from '@angular/router';

export function checkTokenExpiry(store: Store, router: Router) {
  const accessToken = sessionStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const expiresAt = Number(sessionStorage.getItem('accessTokenExpiry')); // Get expiry time

  if (!accessToken || !refreshToken || !expiresAt) {
    console.warn('No tokens found, logging out...');
    logoutUser(store, router);
    return;
  }

  const now = Date.now();
  const timeUntilExpiry = expiresAt - now;
  const warningTime = timeUntilExpiry - (5 * 60 * 1000); // 5 minutes before expiry

  if (timeUntilExpiry <= 0) {
    console.warn('Token already expired, logging out now...');
    logoutUser(store, router);
    return;
  }

  // ✅ Log a warning 5 minutes before token expiry
  if (warningTime > 0) {
    setTimeout(() => {
      console.warn('⚠️ Token will expire in 5 minutes! Refresh or save your work.');
    }, warningTime);
  }

  // ✅ Auto logout when the token expires
  setTimeout(() => {
    console.warn('⏳ Token expired! Logging out user now.');
    logoutUser(store, router);
  }, timeUntilExpiry);
}

export function logoutUser(store: Store, router: Router) {
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('accessTokenExpiry');
  localStorage.removeItem('refreshToken');
  store.dispatch(AuthActions.logout({ refreshToken: '' }));
  router.navigate(['/login']);
}
