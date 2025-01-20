import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const ProfileActions = createActionGroup({
  source: 'Profile',
  events: {
    'Load Profile': emptyProps(),
    'Load Profile Success': props<{ profile: { id: number; email: string; fullname: string; role: string } }>(),
    'Load Profile Failure': props<{ error: string }>()
  }
});
