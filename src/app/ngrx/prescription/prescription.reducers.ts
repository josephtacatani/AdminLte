import { createFeature, createReducer, on } from '@ngrx/store';
import { Prescription } from 'src/app/interfaces/prescription.interface';
import { PrescriptionsActions } from './prescription.actions';

export interface PrescriptionsState {
  isLoading: boolean;
  prescriptions: Prescription[];
  selectedPrescription: Prescription | null;
  prescriptionsByPatient: Prescription[];
  error: string | null;
  deleteMessage: string | null;
}

export const initialPrescriptionsState: PrescriptionsState = {
  isLoading: false,
  prescriptions: [],
  selectedPrescription: null,
  prescriptionsByPatient: [],
  error: null,
  deleteMessage: null,
};

export const prescriptionsFeature = createFeature({
  name: 'prescriptions',
  reducer: createReducer(
    initialPrescriptionsState,

    // Load all prescriptions
    on(PrescriptionsActions.loadPrescriptions, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(PrescriptionsActions.loadPrescriptionsSuccess, (state, { prescriptionsResponse }) => ({
      ...state,
      isLoading: false,
      prescriptions: prescriptionsResponse.data,
      error: null,
    })),
    on(PrescriptionsActions.loadPrescriptionsFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // Load prescription by ID
    on(PrescriptionsActions.loadPrescriptionById, (state) => ({
      ...state,
      isLoading: true,
      selectedPrescription: null,
      error: null,
    })),
    on(PrescriptionsActions.loadPrescriptionByIdSuccess, (state, { prescriptionResponse }) => ({
      ...state,
      isLoading: false,
      selectedPrescription: prescriptionResponse.data,
      error: null,
    })),
    on(PrescriptionsActions.loadPrescriptionByIdFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      selectedPrescription: null,
      error,
    })),

    // Load prescriptions by Patient ID
    on(PrescriptionsActions.loadPrescriptionsByPatientId, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(PrescriptionsActions.loadPrescriptionsByPatientIdSuccess, (state, { prescriptionsResponse }) => ({
      ...state,
      isLoading: false,
      prescriptionsByPatient: prescriptionsResponse.data,
      error: null,
    })),
    on(PrescriptionsActions.loadPrescriptionsByPatientIdFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // Create a prescription
    on(PrescriptionsActions.createPrescription, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(PrescriptionsActions.createPrescriptionSuccess, (state, { prescriptionResponse }) => ({
      ...state,
      isLoading: false,
      prescriptions: [...state.prescriptions, prescriptionResponse.data],
      error: null,
    })),
    on(PrescriptionsActions.createPrescriptionFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // Update a prescription
    on(PrescriptionsActions.updatePrescription, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(PrescriptionsActions.updatePrescriptionSuccess, (state, { prescriptionResponse }) => ({
      ...state,
      isLoading: false,
      prescriptions: state.prescriptions.map(p =>
        p.id === prescriptionResponse.data.id ? prescriptionResponse.data : p
      ),
      error: null,
    })),
    on(PrescriptionsActions.updatePrescriptionFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // Delete a prescription
    on(PrescriptionsActions.deletePrescription, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(PrescriptionsActions.deletePrescriptionSuccess, (state, { id, message }) => ({
      ...state,
      isLoading: false,
      prescriptions: state.prescriptions.filter(p => p.id !== id),
      selectedPrescription: state.selectedPrescription?.id === id ? null : state.selectedPrescription,
      deleteMessage: message,
      error: null,
    })),
    on(PrescriptionsActions.deletePrescriptionFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),
  ),
});

export const {
  name: prescriptionsFeatureKey,
  reducer: prescriptionsReducer,
  selectIsLoading,
  selectPrescriptions,
  selectSelectedPrescription,
  selectPrescriptionsByPatient,
  selectError,
  selectDeleteMessage
} = prescriptionsFeature;
