import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';

import { catchError, delay, map, mergeMap, of, switchMap } from 'rxjs';
import { AppointmentService } from 'src/app/services/appointment/addappointment.service';
import { AppointmentActions } from './addappointment.actions';
import { ApiResponse } from 'src/app/interfaces/addappointment.interface';
import { AlertActions } from '../reusablealerts/reusablealerts.actions';
import { ScheduleActions } from '../schedules/schedule.actions';
import { DentistActions } from '../dentist/dentist.actions';
import { decodeAccessToken } from 'src/app/services/auth/auth.utils';

@Injectable()
export class AppointmentEffects {
  constructor(private actions$: Actions, private appointmentService: AppointmentService) {}

  
  // ✅ Load all appointments
  loadAppointments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.loadAppointments),
      mergeMap(() =>
        this.appointmentService.getAppointments().pipe(
          map((response) => AppointmentActions.loadAppointmentsSuccess({ appointments: response.data || [] })),
          catchError((error) => of(AppointmentActions.loadAppointmentsFailure({ error: error.message })))
        )
      )
    )
  );


  

  // ✅ Load appointment by ID
  loadAppointmentById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.loadAppointmentById),
      mergeMap(({ id }) =>
        this.appointmentService.getAppointmentById(id).pipe(
          map(response => {
            if (!response.data) {
              throw new Error('No appointment data found');
            }
            return AppointmentActions.loadAppointmentByIdSuccess({ appointment: response.data });
          }),
          catchError(error => {
            console.error('Error fetching appointment by ID:', error);
            return of(AppointmentActions.loadAppointmentByIdFailure({ error: error.message || 'Unknown error' }));
          })
        )
      )
    )
  );

  // ✅ Load appointment by Patient ID
  loadAppointmentByPatientId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.loadAppointmentByPatientId),
      mergeMap(({ id }) =>
        this.appointmentService.getAppointmentByPatientId(id).pipe(
          mergeMap(response => {
            if (!response.data) {
              throw new Error('No appointment found for this patient');
            }
            return [
              AppointmentActions.loadAppointmentByPatientIdSuccess({ appointment: response.data }), ];
          }),
          catchError(error => of(AppointmentActions.loadAppointmentByPatientIdFailure({ error: error.message || 'Unknown error' })))
        )
      )
    )
  );
  


  createAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.createAppointment),
      mergeMap(({ appointment }) =>
        this.appointmentService.createAppointment(appointment).pipe(
          map((response: ApiResponse<{ appointmentId: number }>) =>
            AppointmentActions.createAppointmentSuccess({ response }) // ✅ Only dispatch success
          ),
          catchError((error) =>
            of(
              AppointmentActions.createAppointmentFailure({ 
                response: { message: 'Failed to create appointment', error: error.message, data: null }
              }),
              AlertActions.setError({ message: 'Failed to create appointment' }) // ❌ Show error alert
            )
          )
        )
      )
    )
  );

  
  createAppointmentSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.createAppointmentSuccess),
      map(({ response }) => {
        const userData = decodeAccessToken(); // Extract user details from token
  
        if (userData?.role === 'patient') {
          return AppointmentActions.loadAllAppointmentsByPatientId({ patient_id: userData.id });
        } else if (userData?.role === 'dentist') {
          return AppointmentActions.loadAppointments(); // ✅ Load all dentist's appointments
        }
  
        return { type: 'NO_ACTION' }; // Prevents unnecessary actions
      })
    )
  );
  
  
  

  // ✅ Update appointment
  updateAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.updateAppointment),
      mergeMap(({ id, appointment }) =>
        this.appointmentService.updateAppointment(id, appointment).pipe(
          map((response) => 
            AppointmentActions.updateAppointmentSuccess({ response }) // ✅ Pass full response
          ),
          catchError((error) => 
            of(AppointmentActions.updateAppointmentFailure({ error: error.message }))
          )
        )
      )
    )
  );
  
  

  // ✅ Delete appointment
  deleteAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.deleteAppointment),
      mergeMap(({ id }) =>
        this.appointmentService.deleteAppointment(id).pipe(
          map(() => AppointmentActions.deleteAppointmentSuccess({ id })),
          catchError((error) => of(AppointmentActions.deleteAppointmentFailure({ error: error.message })))
        )
      )
    )
  );

    // ✅ Auto-clear success message after 3 seconds
    clearMessages$ = createEffect(() =>
      this.actions$.pipe(
        ofType(
          AppointmentActions.createAppointmentSuccess,
          AppointmentActions.updateAppointmentSuccess,
          AppointmentActions.cancelAppointmentSuccess
        ),
        delay(3000), // ✅ Wait 3 seconds
        map(() => AppointmentActions.clearMessage()) // ✅ Clear messages
      )
    );
    
      // ❌ Auto-clear error message after 3 seconds
      clearError$ = createEffect(() =>
        this.actions$.pipe(
          ofType(
            AppointmentActions.createAppointmentFailure,
            AppointmentActions.updateAppointmentFailure,
            AppointmentActions.cancelAppointmentFailure
          
          ),
          delay(3000), // ⏳ Wait for 3 seconds
          map(() => AppointmentActions.clearError())
        )
      );

    
      loadRelatedData$ = createEffect(() =>
        this.actions$.pipe(
          ofType(AppointmentActions.loadAppointmentByPatientIdSuccess), // Listen for appointment success
          mergeMap(({ appointment }) => {
            return [
              ScheduleActions.loadScheduleById({ schedule_id: appointment.schedule_id }), // Fetch schedule
              DentistActions.loadDentist({ id: appointment.dentist_id }), // Fetch dentist
              ScheduleActions.loadTimeSlotByTimeslotId({ timeslot_id: appointment.timeslot_id }) // Fetch timeslots

            ];
          })
        )
      );

      // ✅ Effect: Cancel Appointment
      cancelAppointment$ = createEffect(() =>
        this.actions$.pipe(
          ofType(AppointmentActions.cancelAppointment),
          switchMap(({ id }) =>
            this.appointmentService.cancelAppointment(id).pipe(
              map((response) =>
                AppointmentActions.cancelAppointmentSuccess({ response })
              ),
              catchError((error) =>
                of(AppointmentActions.cancelAppointmentFailure({
                  response: { message: 'Failed to cancel appointment.', error: error.message, data: null }
                }))
              )
            )
          )
        )
      );
      
      /** ✅ Automatically Refresh Appointment for Logged-in User */
      cancelAppointmentSuccess$ = createEffect(() =>
        this.actions$.pipe(
          ofType(AppointmentActions.cancelAppointmentSuccess),
          map(({ response }) => {
            const userData = decodeAccessToken(); // Get user ID
            if (userData?.id) {
              return AppointmentActions.loadAllAppointmentsByPatientId({ patient_id: userData.id });
            }
            return { type: 'NO_ACTION' }; // Avoid errors if no user is found
          })
        )
      );


        // ✅ Effect: Load All Appointments By Patient ID
  loadAllAppointmentsByPatientId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.loadAllAppointmentsByPatientId),
      mergeMap(({ patient_id }) =>
        this.appointmentService.getAllAppointmentsByPatientId(patient_id).pipe(
          map((response) =>
            AppointmentActions.loadAllAppointmentsByPatientIdSuccess({ detailedAppointments: response.data || [] })
          ),
          catchError((error) =>
            of(AppointmentActions.loadAllAppointmentsByPatientIdFailure({ error: error.message }))
          )
        )
      )
    )
  );
      
}
