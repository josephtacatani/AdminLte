import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { ScheduleActions } from './schedule.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { SchedulesService } from 'src/app/services/schedules/schedule.service';

@Injectable()
export class ScheduleEffects {
  constructor(private actions$: Actions, private scheduleService: SchedulesService) {}

  loadSchedules$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.loadSchedules),
      mergeMap(() =>
        this.scheduleService.getSchedules().pipe(
          map((schedulesResponse) =>
            ScheduleActions.loadSchedulesSuccess({ schedulesResponse })
          ),
          catchError((error) =>
            of(ScheduleActions.loadSchedulesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadScheduleById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.loadScheduleById),
      mergeMap(({ schedule_id }) =>
        this.scheduleService.getScheduleById(schedule_id).pipe(
          map((scheduleResponse) =>
            ScheduleActions.loadScheduleByIdSuccess({ scheduleResponse })
          ),
          catchError((error) =>
            of(ScheduleActions.loadScheduleByIdFailure({ error: error.message }))
          )
        )
      )
    )
  );

    // ✅ Load schedules by Dentist ID
  loadSchedulesByDentist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.loadSchedulesByDentist),
      mergeMap(({ dentistId }) =>
        this.scheduleService.getSchedulesByDentist(dentistId).pipe(
          map((schedulesResponse) =>
            ScheduleActions.loadSchedulesByDentistSuccess({ schedulesResponse })
          ),
          catchError((error) =>
            of(ScheduleActions.loadSchedulesByDentistFailure({ error: error.message }))
          )
        )
      )
    )
  );

  createSchedule$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.createSchedule),
      mergeMap(({ createSchedule }) =>
        this.scheduleService.createSchedule(createSchedule).pipe(
          map((createdSchedule) =>
            ScheduleActions.createScheduleSuccess({ createdSchedule })
          ),
          catchError((error) =>
            of(ScheduleActions.createScheduleFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deleteSchedule$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.deleteSchedule),
      mergeMap(({ id }) =>
        this.scheduleService.deleteSchedule(id).pipe(
          map(({ message }) =>
            ScheduleActions.deleteScheduleSuccess({ message }) // ✅ Extract only `message`
          ),
          catchError((error) =>
            of(ScheduleActions.deleteScheduleFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // ✅ Load available time slots when schedule is selected
  loadTimeSlots$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.loadTimeSlots),
      mergeMap(({ scheduleId }) =>
        this.scheduleService.getTimeSlots(scheduleId).pipe(
          map((timeSlotsResponse) =>
            ScheduleActions.loadTimeSlotsSuccess({ timeSlotsResponse })
          ),
          catchError((error) =>
            of(ScheduleActions.loadTimeSlotsFailure({ error: error.message }))
          )
        )
      )
    )
  );
  
}
