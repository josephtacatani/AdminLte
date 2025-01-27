import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthActions } from './login.actions';
import { LoginResponseError, Token } from 'src/app/interfaces/auth.interfaces';

export interface AuthState {
  isLoading: boolean;
  isSubmitting: boolean;
  loginMessage: string | null;  // ✅ Success Message
  loginError: string | null;
  generatedTokens: Token | null;
  refreshError: string | null;
  logoutMessage: string | null;
  logoutError: string | null;
  showTokenExpiryModal: boolean;
  logoutCountdown: number;
}

export const initialAuthState: AuthState = {
  isLoading: false,
  isSubmitting: false,
  loginMessage: null, // ✅ Success Message
  loginError: null,   // ✅ Separate Error Message
  generatedTokens: null,
  refreshError: null,
  logoutMessage: null,
  logoutError: null,
  showTokenExpiryModal: false,
  logoutCountdown: 60, // Default 60s before logout
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
      loginMessage: null, // ✅ Clear previous success message
      loginError: null,   // ✅ Clear previous error message
    })),

    // ✅ LOGIN SUCCESS (Store success message)
    on(AuthActions.loginSuccess, (state, { loginResponse }) => ({
      ...state,
      loginMessage: loginResponse.message, // ✅ Store success message
      loginError: null,                    // ✅ Clear any previous error
      generatedTokens: { 
        accessToken: loginResponse.data.accessToken, 
        refreshToken: loginResponse.data.refreshToken 
      },
      isLoading: false,
      isSubmitting: false,
    })),

    // ✅ LOGIN FAILURE (Store error message separately)
    on(AuthActions.loginFailure, (state, { loginResponseError }) => ({
      ...state,
      isLoading: false,
      isSubmitting: false,
      loginMessage: null,  
      loginError: loginResponseError.message, // ✅ Store only the string
    })),

        // ✅ Clear login message
    on(AuthActions.clearMessage, (state) => ({
      ...state,
      loginMessage: null
    })),

    // ✅ Clear login error
    on(AuthActions.clearError, (state) => ({
      ...state,
      loginError: null
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
    })),

      // ✅ Update Logout Countdown
  on(AuthActions.updateLogoutCountdown, (state, { remaining }) => ({
    ...state,
    logoutCountdown: remaining
  })),

  // ✅ Hide Modal on Logout or Token Refresh
  on(AuthActions.logout, (state) => ({
    ...state,
    showTokenExpiryModal: false,
    logoutCountdown: 60
  })),

  on(AuthActions.refreshToken, (state) => ({
    ...state,
    showTokenExpiryModal: false,
    logoutCountdown: 60
  }))
  ),
});

export const {
  name: authFeatureKey,
  reducer: authReducer,
  selectIsSubmitting,
  selectIsLoading,
  selectLoginMessage,
  selectLoginError,
  selectGeneratedTokens,
  selectRefreshError,
  selectLogoutMessage,
  selectLogoutError,
  selectLogoutCountdown,
  selectShowTokenExpiryModal
} = authFeature;
