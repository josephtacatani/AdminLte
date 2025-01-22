import { createFeature, createReducer, on } from '@ngrx/store';
import { DentistActions } from './dentist.actions';
import { Dentist } from 'src/app/interfaces/dentist.interface';

export interface DentistState {
  isLoading: boolean;
  dentists: Dentist[];
  selectedDentist: Dentist | null;
  error: string | null;
}

export const initialDentistState: DentistState = {
  isLoading: false,
  dentists: [],
  selectedDentist: null,
  error: null,
};

export const dentistFeature = createFeature({
  name: 'dentists',
  reducer: createReducer(
    initialDentistState,

    // ✅ Load all dentists
    on(DentistActions.loadDentists, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(DentistActions.loadDentistsSuccess, (state, { dentistsResponse }) => ({
      ...state,
      isLoading: false,
      dentists: dentistsResponse.data,
      error: null,
    })),
    on(DentistActions.loadDentistsFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // ✅ Load a specific dentist
    on(DentistActions.loadDentist, (state) => ({
      ...state,
      isLoading: true,
      selectedDentist: null,
      error: null,
    })),
    on(DentistActions.loadDentistSuccess, (state, { dentistResponse }) => ({
      ...state,
      isLoading: false,
      selectedDentist: dentistResponse.data,
      error: null,
    })),
    on(DentistActions.loadDentistFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      selectedDentist: null,
      error,
    })),

    // ✅ Create a dentist
    on(DentistActions.createDentistSuccess, (state, { createdDentist }) => ({
      ...state,
      dentists: [...state.dentists, createdDentist],
      error: null,
    })),

    // ✅ Update a dentist
    on(DentistActions.updateDentistSuccess, (state, { updatedDentist }) => ({
      ...state,
      dentists: state.dentists.map(dentist =>
        dentist.user_id === updatedDentist.user_id ? updatedDentist : dentist
      ),
      selectedDentist: updatedDentist,
      error: null,
    })),

    // ✅ Delete a dentist
    on(DentistActions.deleteDentistSuccess, (state, { id }) => ({
      ...state,
      dentists: state.dentists.filter(dentist => dentist.user_id !== id),
      selectedDentist: null,
      error: null,
    })),

    on(DentistActions.clearError, (state) => ({
      ...state,
      error: null,
    }))
  ),
});

export const {
  name: dentistFeatureKey,
  reducer: dentistReducer,
  selectIsLoading,
  selectDentists,
  selectSelectedDentist,
  selectError,
} = dentistFeature;
