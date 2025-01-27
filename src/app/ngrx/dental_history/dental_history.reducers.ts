import { createFeature, createReducer, on } from '@ngrx/store';
import { DentalHistoryActions } from './dental_history.actions';
import { DentalHistory } from '../../interfaces/dental_history.interface';

export interface DentalHistoryState {
  dentalHistories: DentalHistory[];
  selectedDentalHistoriesByPatientId: DentalHistory[];
  selectedDentalHistory: DentalHistory | null;
  loading: boolean;
  error: string | null;
}

export const initialDentalHistoryState: DentalHistoryState = {
  dentalHistories: [],
  selectedDentalHistoriesByPatientId: [],
  selectedDentalHistory: null,
  loading: false,
  error: null,
};

export const dentalHistoryFeature = createFeature({
  name: 'dentalHistory',
  reducer: createReducer(
    initialDentalHistoryState,

    on(DentalHistoryActions.loadDentalHistories, state => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(DentalHistoryActions.loadDentalHistoriesSuccess, (state, { dentalHistories }) => ({
      ...state,
      dentalHistories: dentalHistories.data,
      loading: false,
      error: null,
    })),
    on(DentalHistoryActions.loadDentalHistoriesFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    on(DentalHistoryActions.loadDentalHistoryById, state => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(DentalHistoryActions.loadDentalHistoryByIdSuccess, (state, { dentalHistory }) => ({
      ...state,
      selectedDentalHistory: dentalHistory.data,
      loading: false,
      error: null,
    })),
    on(DentalHistoryActions.loadDentalHistoryByIdFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    on(DentalHistoryActions.loadDentalHistoriesByPatientId, state => ({
        ...state,
        loading: true,
        error: null,
      })),
      on(DentalHistoryActions.loadDentalHistoriesByPatientIdSuccess, (state, { dentalHistories }) => ({
        ...state,
        selectedDentalHistoriesByPatientId: dentalHistories.data,
        loading: false,
        error: null,
      })),
      on(DentalHistoryActions.loadDentalHistoriesByPatientIdFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
      })),

    on(DentalHistoryActions.createDentalHistory, state => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(DentalHistoryActions.createDentalHistorySuccess, (state, { dentalHistory }) => ({
      ...state,
      dentalHistories: [...state.dentalHistories, dentalHistory.data as DentalHistory],
      loading: false,
      error: null,
    })),
    on(DentalHistoryActions.createDentalHistoryFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    on(DentalHistoryActions.updateDentalHistory, state => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(DentalHistoryActions.updateDentalHistorySuccess, (state, { dentalHistory }) => ({
        ...state,
        dentalHistories: dentalHistory.data
          ? state.dentalHistories.map(dh => (dh.id === dentalHistory.data!.id ? dentalHistory.data! : dh))
          : state.dentalHistories, // Keep existing state if data is null
        loading: false,
        error: null,
      })),
      
    on(DentalHistoryActions.updateDentalHistoryFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    on(DentalHistoryActions.deleteDentalHistory, state => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(DentalHistoryActions.deleteDentalHistorySuccess, (state, { id }) => ({
      ...state,
      dentalHistories: state.dentalHistories.filter(dh => dh.id !== id),
      loading: false,
      error: null,
    })),
    on(DentalHistoryActions.deleteDentalHistoryFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    }))
  ),
});

export const {
  name: dentalHistoryFeatureKey,
  reducer: dentalHistoryReducer,
  selectDentalHistories,
  selectSelectedDentalHistory,
  selectLoading,
  selectError,
  selectSelectedDentalHistoriesByPatientId
} = dentalHistoryFeature;