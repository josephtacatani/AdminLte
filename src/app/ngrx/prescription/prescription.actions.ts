import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Prescription, PrescriptionResponse, PrescriptionsResponse } from "src/app/interfaces/prescription.interface";

export const PrescriptionsActions = createActionGroup({
    source: 'Prescriptions',
    events: {
      'Load Prescriptions': emptyProps(),
      'Load Prescriptions Success': props<{ prescriptionsResponse: PrescriptionsResponse }>(),
      'Load Prescriptions Failure': props<{ error: string }>(),
      'Load Prescription By Id': props<{ id: number }>(),
      'Load Prescription By Id Success': props<{ prescriptionResponse: PrescriptionResponse }>(),
      'Load Prescription By Id Failure': props<{ error: string }>(),
      'Load Prescriptions By Patient Id': props<{ patientId: number }>(),
      'Load Prescriptions By Patient Id Success': props<{ prescriptionsResponse: PrescriptionsResponse }>(),
      'Load Prescriptions By Patient Id Failure': props<{ error: string }>(),
      'Create Prescription': props<{ prescription: Omit<Prescription, 'id' | 'created_at' | 'updated_at'> }>(),
      'Create Prescription Success': props<{ prescriptionResponse: PrescriptionResponse }>(),
      'Create Prescription Failure': props<{ error: string }>(),
      'Update Prescription': props<{ id: number; prescription: Partial<Omit<Prescription, 'created_at' | 'updated_at'>> }>(),
      'Update Prescription Success': props<{ prescriptionResponse: PrescriptionResponse }>(),
      'Update Prescription Failure': props<{ error: string }>(),
      'Delete Prescription': props<{ id: number }>(),
      'Delete Prescription Success': props<{ id: number; message: string }>(),
      'Delete Prescription Failure': props<{ error: string }>(),
    },
  });
