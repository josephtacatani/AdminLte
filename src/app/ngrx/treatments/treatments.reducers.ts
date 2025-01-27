import { createFeature, createReducer, on } from '@ngrx/store';
import { Treatment } from 'src/app/interfaces/treatments.interface';
import { TreatmentActions } from './treatments.actions';


export interface TreatmentState {
  isLoading: boolean;
  treatments: Treatment[];
  selectedTreatment: Treatment | null;
  treatmentsByPatient: Treatment[];
  error: string | null;
  deleteMessage: string | null;
}

export const initialTreatmentState: TreatmentState = {
  isLoading: false,
  treatments: [],
  selectedTreatment: null,
  treatmentsByPatient: [],
  error: null,
  deleteMessage: null,
};

export const treatmentFeature = createFeature({
  name: 'treatments',
  reducer: createReducer(
    initialTreatmentState,

    // ✅ Load all treatments
    on(TreatmentActions.loadTreatments, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(TreatmentActions.loadTreatmentsSuccess, (state, { treatmentsResponse }) => ({
      ...state,
      isLoading: false,
      treatments: treatmentsResponse.data,
      error: null,
    })),
    on(TreatmentActions.loadTreatmentsFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // ✅ Load a treatment by ID
    on(TreatmentActions.loadTreatmentById, (state) => ({
      ...state,
      isLoading: true,
      selectedTreatment: null,
      error: null,
    })),
    on(TreatmentActions.loadTreatmentByIdSuccess, (state, { treatmentResponse }) => ({
      ...state,
      isLoading: false,
      selectedTreatment: treatmentResponse.data,
      error: null,
    })),
    on(TreatmentActions.loadTreatmentByIdFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      selectedTreatment: null,
      error,
    })),

    // ✅ Load treatments by Patient ID
    on(TreatmentActions.loadTreatmentsByPatientId, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(TreatmentActions.loadTreatmentsByPatientIdSuccess, (state, { treatmentsResponse }) => ({
      ...state,
      isLoading: false,
      treatmentsByPatient: treatmentsResponse.data,
      error: null,
    })),
    on(TreatmentActions.loadTreatmentsByPatientIdFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // ✅ Create a treatment
    on(TreatmentActions.createTreatment, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(TreatmentActions.createTreatmentSuccess, (state, { treatmentResponse }) => ({
      ...state,
      isLoading: false,
      treatments: [...state.treatments, treatmentResponse.data],
      error: null,
    })),
    on(TreatmentActions.createTreatmentFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // ✅ Update a treatment
    on(TreatmentActions.updateTreatment, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(TreatmentActions.updateTreatmentSuccess, (state, { treatmentResponse }) => ({
      ...state,
      isLoading: false,
      treatments: state.treatments.map(t =>
        t.id === treatmentResponse.data.id ? treatmentResponse.data : t
      ),
      error: null,
    })),
    on(TreatmentActions.updateTreatmentFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // ✅ Delete a treatment
    on(TreatmentActions.deleteTreatment, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(TreatmentActions.deleteTreatmentSuccess, (state, { id, message }) => ({
      ...state,
      isLoading: false,
      treatments: state.treatments.filter(t => t.id !== id),
      selectedTreatment: state.selectedTreatment?.id === id ? null : state.selectedTreatment,
      deleteMessage: message,
      error: null,
    })),
    on(TreatmentActions.deleteTreatmentFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    }))
  ),
});

export const {
  name: treatmentFeatureKey,
  reducer: treatmentReducer,
  selectIsLoading,
  selectTreatments,
  selectSelectedTreatment,
  selectTreatmentsByPatient,
  selectError,
  selectDeleteMessage
} = treatmentFeature;
