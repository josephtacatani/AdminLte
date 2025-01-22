import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DentistActions } from './dentist.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { DentistService } from 'src/app/services/dentist/dentist.service';


@Injectable()
export class DentistEffects {
  constructor(private actions$: Actions, private dentistService: DentistService) {}

  // ✅ Load all dentists
  loadDentists$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DentistActions.loadDentists),
      mergeMap(() =>
        this.dentistService.getDentists().pipe(
          map((response) => DentistActions.loadDentistsSuccess({ dentistsResponse: response })),
          catchError((error) => of(DentistActions.loadDentistsFailure({ error: error.message })))
        )
      )
    )
  );

  // ✅ Load a specific dentist
  loadDentist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DentistActions.loadDentist),
      mergeMap(({ id }) =>
        this.dentistService.getDentistById(id).pipe(
          map((dentistResponse) => DentistActions.loadDentistSuccess({ dentistResponse })),
          catchError((error) =>
            of(DentistActions.loadDentistFailure({ error: error.error?.message || 'Failed to load dentist.' }))
          )
        )
      )
    )
  );

  // ✅ Create a new dentist (Admin only)
  createDentist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DentistActions.createDentist),
      mergeMap(({ dentistData }) =>
        this.dentistService.createDentist(dentistData).pipe(
          map((response) => {
            if (!response.data) {
              return DentistActions.createDentistFailure({ error: response.message || 'Failed to create dentist.' });
            }
            return DentistActions.createDentistSuccess({ createdDentist: response.data });
          }),
          catchError((error) =>
            of(DentistActions.createDentistFailure({ error: error.error?.message || 'Failed to create dentist.' }))
          )
        )
      )
    )
  );

  // ✅ Update dentist details
  updateDentist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DentistActions.updateDentist),
      mergeMap(({ id, updateData }) =>
        this.dentistService.updateDentist(id, updateData).pipe(
          map((response) => {
            if (!response.data) {
              return DentistActions.updateDentistFailure({ error: response.message || 'Failed to update dentist.' });
            }
            return DentistActions.updateDentistSuccess({ updatedDentist: response.data });
          }),
          catchError((error) =>
            of(DentistActions.updateDentistFailure({ error: error.error?.message || 'Failed to update dentist.' }))
          )
        )
      )
    )
  );

  // ✅ Delete dentist (Admin only)
  deleteDentist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DentistActions.deleteDentist),
      mergeMap(({ id }) =>
        this.dentistService.deleteDentist(id).pipe(
          map(() => DentistActions.deleteDentistSuccess({ id })),
          catchError((error) =>
            of(DentistActions.deleteDentistFailure({ error: error.error?.message || 'Failed to delete dentist.' }))
          )
        )
      )
    )
  );
}
