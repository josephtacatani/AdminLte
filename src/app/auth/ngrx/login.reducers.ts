import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthActions } from './login.actions';
import { Token } from 'src/app/interfaces/auth.interfaces';

export interface AuthState {
  isLoading: boolean;
  isSubmitting: boolean;
  loginMessage: string | null;
  generatedTokens: Token | null;
  refreshError: string | null;
  logoutMessage: string | null;
  logoutError: string | null;
}

export const initialAuthState: AuthState = {
  isLoading: false,
  isSubmitting: false,
  loginMessage: null,
  generatedTokens: null,
  refreshError: null,
  logoutMessage: null,
  logoutError: null,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialAuthState,

    // ✅ LOGIN START
    on(AuthActions.login, (state) => ({
      ...state,
      isLoading: true,
      isSubmitting: true,
      loginMessage: null,
      refreshError: null,
    })),

    // ✅ LOGIN SUCCESS
    on(AuthActions.loginSuccess, (state, { loginResponse }) => ({
      ...state,
      loginMessage: loginResponse.message,
      generatedTokens: { 
        accessToken: loginResponse.data.accessToken, 
        refreshToken: loginResponse.data.refreshToken 
      },
      isLoading: false,
      isSubmitting: false,
      refreshError: null,
    })),

    // ✅ LOGIN FAILURE
    on(AuthActions.loginFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      isSubmitting: false,
      loginMessage: error,
    })),

    // ✅ REFRESH TOKEN START
    on(AuthActions.refreshToken, (state) => ({
      ...state,
      isLoading: true,
      refreshError: null, 
    })),

    // ✅ REFRESH TOKEN SUCCESS
    on(AuthActions.refreshTokenSuccess, (state, { message }) => ({
      ...state,
      isLoading: false,
      refreshError: null,
      generatedTokens: {
        ...(state.generatedTokens || {}), // Preserve existing refreshToken
        accessToken: message, // ✅ Update only the accessToken
      },
    })),

    // ✅ REFRESH TOKEN FAILURE
    on(AuthActions.refreshTokenFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      refreshError: error,
    })),

    // ✅ LOGOUT
    on(AuthActions.logout, (state) => ({
      ...state,
      isLoading: true,
    })),

    // ✅ LOGOUT SUCCESS
    on(AuthActions.logoutSuccess, (state, { message }) => ({
      ...state,
      isLoading: false,
      generatedTokens: null, // Clear tokens on logout success
      logoutMessage: message,
      logoutError: null,
    })),

    // ✅ LOGOUT FAILURE
    on(AuthActions.logoutFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      logoutMessage: null,
      logoutError: error,
    }))
  ),
});

export const {
  name: authFeatureKey,
  reducer: authReducer,
  selectIsSubmitting,
  selectIsLoading,
  selectLoginMessage,
  selectGeneratedTokens,
  selectRefreshError,
  selectLogoutMessage,
  selectLogoutError,
} = authFeature;
