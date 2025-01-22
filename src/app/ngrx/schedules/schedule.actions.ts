import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Schedule, ScheduleResponse, SchedulesResponse, TimeSlotsResponse } from 'src/app/interfaces/schedule.interface';


export const ScheduleActions = createActionGroup({
  source: 'Schedules',
  events: {
    'Load Schedules': emptyProps(),
    'Load Schedules Success': props<{ schedulesResponse: SchedulesResponse}>(),
    'Load Schedules Failure': props<{ error: string }>(),

    'Load Schedule by Id': props<{schedule_id: number}>(),
    'Load Schedule by Id Success': props<{ scheduleResponse: ScheduleResponse}>(),
    'Load Schedule by Id Failure': props<{ error: string }>(),

    'Load Schedules by Dentist': props<{ dentistId: number }>(),
    'Load Schedules by Dentist Success': props<{ schedulesResponse: SchedulesResponse }>(),
    'Load Schedules by Dentist Failure': props<{ error: string }>(),


    'Create Schedule': props<{ createSchedule: Partial<Schedule> }>(),
    'Create Schedule Success': props<{ createdSchedule: ScheduleResponse }>(),
    'Create Schedule Failure': props<{ error: string }>(),

    'Delete Schedule': props<{ id: number }>(),
    'Delete Schedule Success': props<{ message: string}>(),
    'Delete Schedule Failure': props<{ error: string }>(),

    'Load Time Slots': props<{ scheduleId: number }>(),
    'Load Time Slots Success': props<{ timeSlotsResponse: TimeSlotsResponse }>(),
    'Load Time Slots Failure': props<{ error: string }>(),
  }
});