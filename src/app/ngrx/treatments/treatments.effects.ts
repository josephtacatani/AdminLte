import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { TreatmentService } from 'src/app/services/treatments/treatments.service';
import { TreatmentActions } from './treatments.actions';
import { Treatment } from 'src/app/interfaces/treatments.interface';


@Injectable()
export class TreatmentEffects {
  constructor(private actions$: Actions, private service: TreatmentService) {}

  // ✅ Load all treatments
  loadTreatments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TreatmentActions.loadTreatments),
      switchMap(() =>
        this.service.getAllTreatments().pipe(
          map((treatmentsResponse) =>
            TreatmentActions.loadTreatmentsSuccess({ treatmentsResponse })
          ),
          catchError((error) =>
            of(TreatmentActions.loadTreatmentsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // ✅ Load a specific treatment by ID
  loadTreatmentById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TreatmentActions.loadTreatmentById),
      switchMap(({ id }) =>
        this.service.getTreatmentById(id).pipe(
          map((treatmentResponse) =>
            TreatmentActions.loadTreatmentByIdSuccess({ treatmentResponse })
          ),
          catchError((error) =>
            of(TreatmentActions.loadTreatmentByIdFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // ✅ Load treatments by Patient ID
  loadTreatmentsByPatientId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TreatmentActions.loadTreatmentsByPatientId),
      switchMap(({ patientId }) =>
        this.service.getTreatmentsByPatientId(patientId).pipe(
          map((treatmentsResponse) =>
            TreatmentActions.loadTreatmentsByPatientIdSuccess({ treatmentsResponse })
          ),
          catchError((error) =>
            of(TreatmentActions.loadTreatmentsByPatientIdFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // ✅ Create a new treatment
  createTreatment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TreatmentActions.createTreatment),
      mergeMap(({ treatment }) =>
        this.service.addTreatment(treatment).pipe(
          map((treatmentResponse) =>
            TreatmentActions.createTreatmentSuccess({ treatmentResponse })
          ),
          catchError((error) =>
            of(TreatmentActions.createTreatmentFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // ✅ Update an existing treatment
  updateTreatment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TreatmentActions.updateTreatment),
      mergeMap(({ id, treatment }) =>
        this.service.updateTreatment(id, treatment).pipe(
          map((treatmentResponse) =>
            TreatmentActions.updateTreatmentSuccess({ treatmentResponse })
          ),
          catchError((error) =>
            of(TreatmentActions.updateTreatmentFailure({ error: error.message }))
          )
        )
      )
    )
  );
  
  

  // ✅ Delete a treatment
  deleteTreatment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TreatmentActions.deleteTreatment),
      mergeMap(({ id }) =>
        this.service.deleteTreatment(id).pipe(
          map(({ message }) =>
            TreatmentActions.deleteTreatmentSuccess({ id, message })
          ),
          catchError((error) =>
            of(TreatmentActions.deleteTreatmentFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
