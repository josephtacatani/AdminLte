import { createFeature, createReducer, on } from '@ngrx/store';
import { AlertActions } from './reusablealerts.actions';


export interface AlertState {
  successMessage: string | null;
  errorMessage: string | null;
}

export const initialAlertState: AlertState = {
  successMessage: null,
  errorMessage: null,
};

export const alertFeature = createFeature({
  name: 'alert',
  reducer: createReducer(
    initialAlertState,

    // ✅ Set success message
    on(AlertActions.setSuccess, (state, { message }) => ({
      ...state,
      successMessage: message,
    })),

    // ❌ Set error message
    on(AlertActions.setError, (state, { message }) => ({
      ...state,
      errorMessage: message,
    })),

    // ✅ Clear success message
    on(AlertActions.clearSuccess, (state) => ({
      ...state,
      successMessage: null,
    })),

    // ❌ Clear error message
    on(AlertActions.clearError, (state) => ({
      ...state,
      errorMessage: null,
    }))
  ),
});

export const {
  name: alertFeatureKey,
  reducer: alertReducer,
  selectSuccessMessage,
  selectErrorMessage
} = alertFeature;
