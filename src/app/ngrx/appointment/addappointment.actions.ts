import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ApiResponse, Appointment, DetailedAppointment } from 'src/app/interfaces/addappointment.interface';


export const AppointmentActions = createActionGroup({
  source: 'Appointments',
  events: {
    
    // ✅ Load all appointments
    'Load Appointments': emptyProps(),
    'Load Appointments Success': props<{ appointments: Appointment[] }>(),
    'Load Appointments Failure': props<{ error: string }>(),

    // ✅ Load appointment by ID
    'Load Appointment By Id': props<{ id: number }>(),
    'Load Appointment By Id Success': props<{ appointment: Appointment }>(),
    'Load Appointment By Id Failure': props<{ error: string }>(),

    // ✅ Load appointment by Patient ID
    'Load Appointment By Patient Id': props<{ id: number }>(),
    'Load Appointment By Patient Id Success': props<{ appointment: Appointment }>(),
    'Load Appointment By Patient Id Failure': props<{ error: string }>(),


    // ✅ Create appointment
    'Create Appointment': props<{ appointment: Partial<Appointment>; service_list_id: number[] }>(),
    'Create Appointment Success': props<{ response: ApiResponse<{ appointmentId: number }> }>(),
    'Create Appointment Failure': props<{ response: ApiResponse<null> }>(),

    // ✅ Update appointment
    'Update Appointment': props<{ id: number; appointment: Partial<Appointment> }>(),
    'Update Appointment Success': props<{ appointment: Appointment }>(),
    'Update Appointment Failure': props<{ error: string }>(),

    // ✅ Delete appointment
    'Delete Appointment': props<{ id: number }>(),
    'Delete Appointment Success': props<{ id: number }>(),
    'Delete Appointment Failure': props<{ error: string }>(),

        // ✅ Add actions to clear messages after 3s
        'Clear Message': emptyProps(),
        'Clear Error': emptyProps(),

            // ✅ Cancel appointment
    'Cancel Appointment': props<{ id: number }>(),
    'Cancel Appointment Success': props<{ response: ApiResponse<{ appointmentId: number }> }>(),
    'Cancel Appointment Failure': props<{ response: ApiResponse<null> }>(),

        // ✅ Load all detailed appointments for a patient
        'Load All Appointments By Patient Id': props<{ patient_id: number }>(),
        'Load All Appointments By Patient Id Success': props<{ detailedAppointments: DetailedAppointment[] }>(),
        'Load All Appointments By Patient Id Failure': props<{ error: string }>(),
    
  },
});
