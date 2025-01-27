import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { PrescriptionsService } from "src/app/services/prescription/prescription.service";
import { catchError, map, mergeMap, of, switchMap } from "rxjs";
import { PrescriptionsActions } from "./prescription.actions";

@Injectable()
export class PrescriptionsEffects {
  constructor(private actions$: Actions, private service: PrescriptionsService) {}

  // Load all prescriptions
  loadPrescriptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrescriptionsActions.loadPrescriptions),
      switchMap(() =>
        this.service.getPrescriptions().pipe(
          map(prescriptionsResponse =>
            PrescriptionsActions.loadPrescriptionsSuccess({ prescriptionsResponse })
          ),
          catchError(error =>
            of(PrescriptionsActions.loadPrescriptionsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Load prescriptions by patient ID (New Effect)
  loadPrescriptionsByPatientId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrescriptionsActions.loadPrescriptionsByPatientId),
      switchMap(({ patientId }) =>
        this.service.getPrescriptionsByPatientId(patientId).pipe(
          map(prescriptionsResponse =>
            PrescriptionsActions.loadPrescriptionsByPatientIdSuccess({ prescriptionsResponse })
          ),
          catchError(error =>
            of(PrescriptionsActions.loadPrescriptionsByPatientIdFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Load a specific prescription by ID
  loadPrescriptionById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrescriptionsActions.loadPrescriptionById),
      switchMap(({ id }) =>
        this.service.getPrescriptionById(id).pipe(
          map(prescriptionResponse =>
            PrescriptionsActions.loadPrescriptionByIdSuccess({ prescriptionResponse })
          ),
          catchError(error =>
            of(PrescriptionsActions.loadPrescriptionByIdFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Create a new prescription
  createPrescription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrescriptionsActions.createPrescription),
      mergeMap(({ prescription }) =>
        this.service.createPrescription(prescription).pipe(
          map(prescriptionResponse =>
            PrescriptionsActions.createPrescriptionSuccess({ prescriptionResponse })
          ),
          catchError(error =>
            of(PrescriptionsActions.createPrescriptionFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Update an existing prescription
  updatePrescription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrescriptionsActions.updatePrescription),
      mergeMap(({ id, prescription }) =>
        this.service.updatePrescription(id, prescription).pipe(
          map(prescriptionResponse =>
            PrescriptionsActions.updatePrescriptionSuccess({ prescriptionResponse })
          ),
          catchError(error =>
            of(PrescriptionsActions.updatePrescriptionFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Delete a prescription
  deletePrescription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrescriptionsActions.deletePrescription),
      mergeMap(({ id }) =>
        this.service.deletePrescription(id).pipe(
          map(({ message }) =>
            PrescriptionsActions.deletePrescriptionSuccess({ id, message })
          ),
          catchError(error =>
            of(PrescriptionsActions.deletePrescriptionFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
