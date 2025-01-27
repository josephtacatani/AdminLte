import { createFeature, createReducer, on } from '@ngrx/store';
import { AlertActions } from './reusablealerts.actions';


export interface AlertState {
  successMessage: string | null;
  errorMessage: string | null;
  warningMessage: string | null; // ⚠️ NEW
  infoMessage: string | null;    // ℹ️ NEW
}


export const initialAlertState: AlertState = {
  successMessage: null,
  errorMessage: null,
  warningMessage: null, // ⚠️ NEW
  infoMessage: null     // ℹ️ NEW
};


export const alertFeature = createFeature({
  name: 'alert',
  reducer: createReducer(
    initialAlertState,

    // ✅ Set success message
    on(AlertActions.setSuccess, (state, { message }) => ({
      ...state,
      successMessage: message
    })),

    // ❌ Set error message
    on(AlertActions.setError, (state, { message }) => ({
      ...state,
      errorMessage: message
    })),

    // ⚠️ Set warning message
    on(AlertActions.setWarning, (state, { message }) => ({
      ...state,
      warningMessage: message
    })),

    // ℹ️ Set info message
    on(AlertActions.setInfo, (state, { message }) => ({
      ...state,
      infoMessage: message
    })),

    // ✅ Clear success message
    on(AlertActions.clearSuccess, (state) => ({
      ...state,
      successMessage: null
    })),

    // ❌ Clear error message
    on(AlertActions.clearError, (state) => ({
      ...state,
      errorMessage: null
    })),

    // ⚠️ Clear warning message
    on(AlertActions.clearWarning, (state) => ({
      ...state,
      warningMessage: null
    })),

    // ℹ️ Clear info message
    on(AlertActions.clearInfo, (state) => ({
      ...state,
      infoMessage: null
    }))
  ),
});

export const {
  name: alertFeatureKey,
  reducer: alertReducer,
  selectSuccessMessage,
  selectErrorMessage,
  selectInfoMessage,
  selectWarningMessage
} = alertFeature;
