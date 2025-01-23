import { createFeature, createReducer, on } from '@ngrx/store';
import { ScheduleActions } from './schedule.actions';
import { Schedule, TimeSlot } from 'src/app/interfaces/schedule.interface';

export interface ScheduleState {
  isLoading: boolean;
  schedules: Schedule[];
  selectedSchedule: Schedule | null;
  error: string | null;
  deleteMessage: string | null;
  timeSlots: TimeSlot[];
  allTimeSlots: TimeSlot[]; // ✅ Added for all timeslots
  timeSlotsById: TimeSlot[];
}

export const initialScheduleState: ScheduleState = {
  isLoading: false,
  schedules: [],
  selectedSchedule: null,
  error: null,
  deleteMessage: null,
  timeSlots: [],
  allTimeSlots: [],// ✅ Added for all timeslots
  timeSlotsById: []
};

export const scheduleFeature = createFeature({
  name: 'schedule',
  reducer: createReducer(
    initialScheduleState,

    // ✅ Load all schedules
    on(ScheduleActions.loadSchedules, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(ScheduleActions.loadSchedulesSuccess, (state, { schedulesResponse }) => ({
      ...state,
      isLoading: false,
      schedules: schedulesResponse.data,
      error: null,
    })),
    on(ScheduleActions.loadSchedulesFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // ✅ Load schedules by Dentist ID
    on(ScheduleActions.loadSchedulesByDentist, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(ScheduleActions.loadSchedulesByDentistSuccess, (state, { schedulesResponse }) => ({
      ...state,
      isLoading: false,
      schedules: schedulesResponse.data, // ✅ Only schedules for the selected dentist
      error: null,
    })),
    on(ScheduleActions.loadSchedulesByDentistFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // ✅ Load a specific schedule by ID
    on(ScheduleActions.loadScheduleById, (state) => ({
      ...state,
      isLoading: true,
      selectedSchedule: null,
      error: null,
    })),
    on(ScheduleActions.loadScheduleByIdSuccess, (state, { scheduleResponse }) => ({
      ...state,
      isLoading: false,
      selectedSchedule: scheduleResponse.data,
      error: null,
    })),
    on(ScheduleActions.loadScheduleByIdFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      selectedSchedule: null,
      error,
    })),

    // ✅ Create a schedule
    on(ScheduleActions.createSchedule, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(ScheduleActions.createScheduleSuccess, (state, { createdSchedule }) => ({
      ...state,
      isLoading: false,
      schedules: [...state.schedules, createdSchedule.data],
      error: null,
    })),
    on(ScheduleActions.createScheduleFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // ✅ Delete a schedule
    on(ScheduleActions.deleteSchedule, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(ScheduleActions.deleteScheduleSuccess, (state, { message }) => ({
      ...state,
      isLoading: false,
      schedules: state.schedules.filter(schedule => schedule.id !== state.selectedSchedule?.id),
      selectedSchedule: null,
      deleteMessage: message,
      error: null,
    })),
    on(ScheduleActions.deleteScheduleFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),
    // ✅ Load available time slots
    on(ScheduleActions.loadTimeSlots, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(ScheduleActions.loadTimeSlotsSuccess, (state, { timeSlotsResponse }) => ({
      ...state,
      isLoading: false,
      timeSlots: timeSlotsResponse.data,
      error: null,
    })),
    on(ScheduleActions.loadTimeSlotsFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),
    // ✅ Load all time slots
on(ScheduleActions.loadAllTimeSlots, (state) => ({
  ...state,
  isLoading: true,
  error: null,
})),
on(ScheduleActions.loadAllTimeSlotsSuccess, (state, { timeSlotsResponse }) => ({
  ...state,
  isLoading: false,
  allTimeSlots: timeSlotsResponse.data, // Store all timeslots
  error: null,
})),
on(ScheduleActions.loadAllTimeSlotsFailure, (state, { error }) => ({
  ...state,
  isLoading: false,
  error,
})),

// ✅ Load all time slots by schedule ID
on(ScheduleActions.loadAllTimeSlotsById, (state) => ({
  ...state,
  isLoading: true,
  error: null,
})),
on(ScheduleActions.loadAllTimeSlotsByIdSuccess, (state, { timeSlotsResponse }) => ({
  ...state,
  isLoading: false,
  timeSlotsById: timeSlotsResponse.data, // ✅ Store timeslots for the given schedule ID
  error: null,
})),
on(ScheduleActions.loadAllTimeSlotsByIdFailure, (state, { error }) => ({
  ...state,
  isLoading: false,
  error,
})),

    

  ),
});

export const {
  name: scheduleFeatureKey,
  reducer: scheduleReducer,
  selectIsLoading,
  selectSchedules,
  selectSelectedSchedule,
  selectError,
  selectDeleteMessage,
  selectTimeSlots,
  selectAllTimeSlots,
  selectTimeSlotsById
} = scheduleFeature;
