import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Treatment, TreatmentResponse, TreatmentsResponse } from 'src/app/interfaces/treatments.interface';


export const TreatmentActions = createActionGroup({
  source: 'Treatments',
  events: {
    'Load Treatments': emptyProps(),
    'Load Treatments Success': props<{ treatmentsResponse: TreatmentsResponse }>(),
    'Load Treatments Failure': props<{ error: string }>(),

    'Load Treatment By Id': props<{ id: number }>(),
    'Load Treatment By Id Success': props<{ treatmentResponse: TreatmentResponse }>(),
    'Load Treatment By Id Failure': props<{ error: string }>(),

    'Load Treatments By Patient Id': props<{ patientId: number }>(),
    'Load Treatments By Patient Id Success': props<{ treatmentsResponse: TreatmentsResponse }>(),
    'Load Treatments By Patient Id Failure': props<{ error: string }>(),

    'Create Treatment': props<{ treatment: Omit<Treatment, 'id' | 'created_at' | 'updated_at'> }>(),
    'Create Treatment Success': props<{ treatmentResponse: TreatmentResponse }>(),
    'Create Treatment Failure': props<{ error: string }>(),

    'Update Treatment': props<{ id: number; treatment: Partial<Omit<Treatment, 'id' | 'created_at' | 'updated_at'>> }>(),
    'Update Treatment Success': props<{ treatmentResponse: TreatmentResponse }>(),
    'Update Treatment Failure': props<{ error: string }>(),

    'Delete Treatment': props<{ id: number }>(),
    'Delete Treatment Success': props<{ id: number; message: string }>(),
    'Delete Treatment Failure': props<{ error: string }>(),
  },
});
