import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DentalHistory, DentalHistoryResponse, DentalHistoriesListResponse } from '../../interfaces/dental_history.interface';

export const DentalHistoryActions = createActionGroup({
  source: 'DentalHistory',
  events: {
    'Load Dental Histories': emptyProps(),
    'Load Dental Histories Success': props<{ dentalHistories: DentalHistoriesListResponse }>(),
    'Load Dental Histories Failure': props<{ error: string }>(),

    'Load Dental History By Id': props<{ id: number }>(),
    'Load Dental History By Id Success': props<{ dentalHistory: DentalHistoryResponse }>(),
    'Load Dental History By Id Failure': props<{ error: string }>(),

    'Load Dental Histories By Patient Id': props<{ patientId: number }>(),
    'Load Dental Histories By Patient Id Success': props<{ dentalHistories: DentalHistoriesListResponse }>(),
    'Load Dental Histories By Patient Id Failure': props<{ error: string }>(),

    'Create Dental History': props<{ dentalHistory: Partial<DentalHistory> }>(),
    'Create Dental History Success': props<{ dentalHistory: DentalHistoryResponse }>(),
    'Create Dental History Failure': props<{ error: string }>(),

    'Update Dental History': props<{ id: number, dentalHistory: Partial<DentalHistory> }>(),
    'Update Dental History Success': props<{ dentalHistory: DentalHistoryResponse }>(),
    'Update Dental History Failure': props<{ error: string }>(),

    'Delete Dental History': props<{ id: number }>(),
    'Delete Dental History Success': props<{ id: number }>(),
    'Delete Dental History Failure': props<{ error: string }>(),

        // ✅ New actions to clear messages & errors
        'Clear Message': emptyProps(),
        'Clear Error': emptyProps(),
  }
});