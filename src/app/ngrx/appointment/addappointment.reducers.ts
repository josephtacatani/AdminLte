import { createFeature, createReducer, on } from '@ngrx/store';
import { Appointment } from 'src/app/interfaces/addappointment.interface';
import { AppointmentActions } from './addappointment.actions';


// ✅ Define Appointment State
export interface AppointmentState {
  isLoading: boolean;
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  selectedAppointmentPatient: Appointment | null;
  error: string | null;
  message: string | null;
}

export const initialAppointmentState: AppointmentState = {
  isLoading: false,
  appointments: [],
  selectedAppointment: null,
  selectedAppointmentPatient:  null,
  error: null,
  message: null
};

// ✅ Define Feature Reducer
export const appointmentFeature = createFeature({
  name: 'appointment',
  reducer: createReducer(
    initialAppointmentState,

    // ✅ Load all appointments
    on(AppointmentActions.loadAppointments, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(AppointmentActions.loadAppointmentsSuccess, (state, { appointments }) => ({
      ...state,
      isLoading: false,
      appointments,
      error: null,
    })),
    on(AppointmentActions.loadAppointmentsFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // ✅ Load appointment by ID
    on(AppointmentActions.loadAppointmentById, (state) => ({
      ...state,
      isLoading: true,
      selectedAppointment: null,
      error: null,
    })),
    on(AppointmentActions.loadAppointmentByIdSuccess, (state, { appointment }) => ({
      ...state,
      isLoading: false,
      selectedAppointment: appointment,
      error: null,
    })),
    on(AppointmentActions.loadAppointmentByIdFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      selectedAppointment: null,
      error,
    })),

    // ✅ Create appointment
    // ✅ Create appointment
    on(AppointmentActions.createAppointment, (state) => ({
        ...state,
        isLoading: true,
        message: null,
        error: null,
      })),
  
      // ✅ Store API response
      on(AppointmentActions.createAppointmentSuccess, (state, { response }) => ({
        ...state,
        isLoading: false,
        appointmentId: response.data?.appointmentId ?? null,
        message: response.message,
        error: null,
      })),
  
      // ✅ Store error response
      on(AppointmentActions.createAppointmentFailure, (state, { response }) => ({
        ...state,
        isLoading: false,
        appointmentId: null,
        message: response.message,
        error: response.error ?? null,
      })),

    // ✅ Update appointment
    on(AppointmentActions.updateAppointment, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(AppointmentActions.updateAppointmentSuccess, (state, { appointment }) => ({
      ...state,
      isLoading: false,
      selectedAppointment: appointment,
      error: null,
    })),
    on(AppointmentActions.updateAppointmentFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // ✅ Delete appointment
    on(AppointmentActions.deleteAppointment, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(AppointmentActions.deleteAppointmentSuccess, (state, { id }) => ({
      ...state,
      isLoading: false,
      appointments: state.appointments.filter((appointment) => appointment.id !== id),
      selectedAppointment: state.selectedAppointment?.id === id ? null : state.selectedAppointment,
      error: null,
    })),
    on(AppointmentActions.deleteAppointmentFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

      // ✅ Load Appointment by Patient ID
  on(AppointmentActions.loadAppointmentByPatientId, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(AppointmentActions.loadAppointmentByPatientIdSuccess, (state, { appointment }) => ({
    ...state,
    isLoading: false,
    selectedAppointmentPatient: appointment,
    error: null,
  })),
  on(AppointmentActions.loadAppointmentByPatientIdFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    selectedAppointmentPatient: null,
    error,
  })),

  // ✅ Cancel Appointment - Sets loading state
on(AppointmentActions.cancelAppointment, (state) => ({
  ...state,
  isLoading: true,
  error: null,
})),

// ✅ Cancel Appointment Success - Updates the state with 'canceled' status
on(AppointmentActions.cancelAppointmentSuccess, (state, { response }) => ({
  ...state,
  isLoading: false,
  message: response.message,
  error: null,
  appointments: state.appointments.map((appt) =>
    appt.id === response.data?.appointmentId
      ? { ...appt, status: "canceled" as "canceled" } // ✅ Explicitly set type
      : appt
  ),
  selectedAppointment: state.selectedAppointment?.id === response.data?.appointmentId
    ? {
        ...(state.selectedAppointment as Appointment), // ✅ Ensures correct type
        status: "canceled" as "canceled",
      }
    : state.selectedAppointment,
})),


// ✅ Cancel Appointment Failure - Stores error message
on(AppointmentActions.cancelAppointmentFailure, (state, { response }) => ({
  ...state,
  isLoading: false,
  error: response.message,
})),

  
    
        // ✅ Clears only the success message
        on(AppointmentActions.clearMessage, (state) => ({
            ...state,
            message: null,
          })),
      
          // ❌ Clears only the error message
          on(AppointmentActions.clearError, (state) => ({
            ...state,
            error: null,
          }))
  ),
});

// ✅ Export Selectors & Reducer
export const {
  name: appointmentFeatureKey,
  reducer: appointmentReducer,
  selectIsLoading,
  selectAppointments,
  selectSelectedAppointment,
  selectError,
  selectMessage,
  selectSelectedAppointmentPatient
} = appointmentFeature;
