import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Dentist, DentistResponse, DentistsListResponse } from 'src/app/interfaces/dentist.interface';

export const DentistActions = createActionGroup({
  source: 'Dentists',
  events: {
    // ✅ Load all dentists
    'Load Dentists': emptyProps(),
    'Load Dentists Success': props<{ dentistsResponse: DentistsListResponse }>(),
    'Load Dentists Failure': props<{ error: string }>(),

    // ✅ Load a specific dentist
    'Load Dentist': props<{ id: number }>(),
    'Load Dentist Success': props<{ dentistResponse: DentistResponse }>(),
    'Load Dentist Failure': props<{ error: string }>(),

    // ✅ Create a new dentist
    'Create Dentist': props<{ dentistData: Partial<Dentist> }>(),
    'Create Dentist Success': props<{ createdDentist: Dentist }>(),
    'Create Dentist Failure': props<{ error: string }>(),

    // ✅ Update a dentist
    'Update Dentist': props<{ id: number; updateData: Partial<Dentist> }>(),
    'Update Dentist Success': props<{ updatedDentist: Dentist }>(),
    'Update Dentist Failure': props<{ error: string }>(),

    // ✅ Delete a dentist
    'Delete Dentist': props<{ id: number }>(),
    'Delete Dentist Success': props<{ id: number }>(),
    'Delete Dentist Failure': props<{ error: string }>(),

    // ✅ Clear Errors
    'Clear Error': emptyProps(),
  },
});
