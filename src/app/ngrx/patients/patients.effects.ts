import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PatientsActions } from './patients.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { PatientsService } from 'src/app/services/patients/patient_details.service';

@Injectable()
export class PatientsEffects {
  constructor(private actions$: Actions, private patientsService: PatientsService) {}

  // ✅ Load all patients
  loadPatients$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PatientsActions.loadPatients),
      mergeMap(() =>
        this.patientsService.getPatients().pipe(
          map((response) => PatientsActions.loadPatientsSuccess({ patientsResponse: response })),
          catchError((error) => of(PatientsActions.loadPatientsFailure({ error: error.message })))
        )
      )
    )
  );

  // ✅ Load a specific patient
  loadPatient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PatientsActions.loadPatient),
      mergeMap(({ id }) =>
        this.patientsService.getPatientByUserId(id).pipe(
          map((patient) => { // ✅ Renamed response to patient
            if (!patient.data) {
              return PatientsActions.loadPatientFailure({ error: patient.message || 'Patient not found.' });
            }
            return PatientsActions.loadPatientSuccess({ patient }); // ✅ Correct property name
          }),
          catchError((error) =>
            of(
              PatientsActions.loadPatientFailure({
                error: error.error?.message || 'Failed to load patient.',
              })
            )
          )
        )
      )
    )
  );
  

// ✅ Update patient effect
//   updatePatient$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(PatientsActions.updatePatient),
//       mergeMap(({ id, updateData }) =>
//         this.patientsService.updatePatient(id, updateData).pipe(
//           map((updatedPatient) => PatientsActions.updatePatientSuccess({ updatedPatient })),
//           catchError((error) => of(PatientsActions.updatePatientFailure({ error: error.message })))
//         )
//       )
//     )
//   );
}
