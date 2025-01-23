import { createSelector } from '@ngrx/store';
import { appointmentFeature } from './addappointment.reducers';

// ✅ Select all appointments from the store
export const selectAppointments = createSelector(
  appointmentFeature.selectAppointments,
  (appointments) => appointments
);

// ✅ Find appointment by `patient_id`
export const selectAppointmentByPatientId = (patientId: number) =>
  createSelector(selectAppointments, (appointments) =>
    appointments.find(appointment => appointment.patient_id === patientId) || null
  );

// ✅ Extract `appointment_id` using `patient_id`
export const selectAppointmentIdByPatientId = (patientId: number) =>
  createSelector(selectAppointmentByPatientId(patientId), (appointment) =>
    appointment?.id ?? null // Ensures no `undefined` value
  );
