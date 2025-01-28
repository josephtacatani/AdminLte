import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, map, mergeMap, of, tap } from 'rxjs';
import { DentalHistoryActions } from './dental_history.actions';
import { DentalHistoryService } from 'src/app/services/patients/patient-dental-history-service';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class DentalHistoryEffects {
  constructor(private actions$: Actions, private dentalHistoryService: DentalHistoryService, private store: Store, private route: ActivatedRoute) {}

  loadDentalHistories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DentalHistoryActions.loadDentalHistories),
      mergeMap(() =>
        this.dentalHistoryService.getAllDentalHistories().pipe(
          map(response => DentalHistoryActions.loadDentalHistoriesSuccess({ dentalHistories: response })),
          catchError(error => of(DentalHistoryActions.loadDentalHistoriesFailure({ error: error.message })))
        )
      )
    )
  );

  loadDentalHistoryById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DentalHistoryActions.loadDentalHistoryById),
      mergeMap(({ id }) =>
        this.dentalHistoryService.getDentalHistoryById(id).pipe(
          map(response => DentalHistoryActions.loadDentalHistoryByIdSuccess({ dentalHistory: response })),
          catchError(error => of(DentalHistoryActions.loadDentalHistoryByIdFailure({ error: error.message })))
        )
      )
    )
  );

  loadDentalHistoriesByPatientId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DentalHistoryActions.loadDentalHistoriesByPatientId),
      mergeMap(({patientId}) =>
        this.dentalHistoryService.getDentalHistoryByPatientId(patientId).pipe(
          map(response => DentalHistoryActions.loadDentalHistoriesByPatientIdSuccess({ dentalHistories: response })),
          catchError(error => of(DentalHistoryActions.loadDentalHistoriesByPatientIdFailure({ error: error.message })))
        )
      )
    )
  );

  createDentalHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DentalHistoryActions.createDentalHistory),
      mergeMap(({ dentalHistory }) =>
        this.dentalHistoryService.addDentalHistory(dentalHistory).pipe(
          map(response => DentalHistoryActions.createDentalHistorySuccess({ dentalHistory: response })),
          catchError(error => of(DentalHistoryActions.createDentalHistoryFailure({ error: error.message })))
        )
      )
    )
  );

  

  updateDentalHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DentalHistoryActions.updateDentalHistory),
      mergeMap(({ id, dentalHistory }) =>
        this.dentalHistoryService.updateDentalHistory(id, dentalHistory).pipe(
          map(response => DentalHistoryActions.updateDentalHistorySuccess({ dentalHistory: response })),
          catchError(error => of(DentalHistoryActions.updateDentalHistoryFailure({ error: error.message })))
        )
      )
    )
  );

  deleteDentalHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DentalHistoryActions.deleteDentalHistory),
      mergeMap(({ id }) =>
        this.dentalHistoryService.deleteDentalHistory(id).pipe(
          map(() => DentalHistoryActions.deleteDentalHistorySuccess({ id })),
          catchError(error => of(DentalHistoryActions.deleteDentalHistoryFailure({ error: error.message })))
        )
      )
    )
  );

  
    // ✅ Automatically clear success messages after 3 seconds
    clearMessage$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DentalHistoryActions.createDentalHistorySuccess, 
          DentalHistoryActions.updateDentalHistorySuccess, 
          DentalHistoryActions.deleteDentalHistorySuccess),
        delay(3000), // ⏳ Wait 3 seconds
        map(() => DentalHistoryActions.clearMessage())
      )
    );
  
    // ❌ Automatically clear error messages after 3 seconds
    clearError$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DentalHistoryActions.createDentalHistoryFailure, DentalHistoryActions.updateDentalHistoryFailure, DentalHistoryActions.deleteDentalHistoryFailure),
        delay(3000), // ⏳ Wait 3 seconds
        map(() => DentalHistoryActions.clearError())
      )
    );
}