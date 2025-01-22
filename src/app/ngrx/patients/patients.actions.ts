import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Patient, PatientResponse, PatientsListResponse } from 'src/app/interfaces/patient_details.interface';


export const PatientsActions = createActionGroup({
  source: 'Patients',
  events: {
    'Load Patients': emptyProps(),
    'Load Patients Success': props<{ patientsResponse: PatientsListResponse }>(),
    'Load Patients Failure': props<{ error: string }>(),

    'Load Patient': props<{ id: number }>(),
    'Load Patient Success': props<{ patient: PatientResponse }>(), 
    'Load Patient Failure': props<{ error: string }>(),

    'Update Patient': props<{ id: number; updateData: Partial<Patient> }>(), // ✅ Allows partial updates
    'Update Patient Success': props<{ updatedPatient: Patient }>(),
    'Update Patient Failure': props<{ error: string }>(),

    'Clear Error': emptyProps(),
  }
});
