import { createFeature, createReducer, on } from '@ngrx/store';
import { PatientsActions } from './patients.actions';
import { Patient } from 'src/app/interfaces/patient_details.interface';


export interface PatientsState {
  isLoading: boolean;
  patients: Patient[];
  selectedPatient: Patient | null;
  error: string | null;
}

export const initialPatientsState: PatientsState = {
  isLoading: false,
  patients: [],
  selectedPatient: null,
  error: null,
};

export const patientsFeature = createFeature({
  name: 'patients',
  reducer: createReducer(
    initialPatientsState,

    // ✅ Load all patients
    on(PatientsActions.loadPatients, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(PatientsActions.loadPatientsSuccess, (state, { patientsResponse }) => ({
      ...state,
      isLoading: false,
      patients: patientsResponse.data, // ✅ Always store `data`
      error: null,
    })),
    on(PatientsActions.loadPatientsFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // ✅ Load a specific patient
    on(PatientsActions.loadPatient, (state) => ({
      ...state,
      isLoading: true,
      selectedPatient: null, // ✅ Reset before loading
      error: null,
    })),
    on(PatientsActions.loadPatientSuccess, (state, { patient }) => ({
      ...state,
      isLoading: false,
      selectedPatient: patient.data, // 
      error: null,
    })),
    on(PatientsActions.loadPatientFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      selectedPatient: null, // ✅ Ensure no patient remains selected on failure
      error,
    })),

    on(PatientsActions.updatePatient, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(PatientsActions.updatePatientSuccess, (state, { updatedPatient }) => ({
      ...state,
      isLoading: false,
      patients: state.patients.map(patient =>
        patient.user_id === updatedPatient.user_id ? updatedPatient : patient
      ),
      selectedPatient: updatedPatient,
      error: null,
    })),
    on(PatientsActions.updatePatientFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    on(PatientsActions.clearError, (state) => ({
      ...state,
      error: null,
    }))
  ),
});

export const {
  name: patientsFeatureKey,
  reducer: patientsReducer,
  selectIsLoading,
  selectPatients,
  selectSelectedPatient,
  selectError,
} = patientsFeature;
