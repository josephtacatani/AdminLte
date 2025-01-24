import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const AlertActions = createActionGroup({
  source: 'Alerts',
  events: {
    'Set Success': props<{ message: string }>(), // ✅ Set success message
    'Set Error': props<{ message: string }>(),   // ❌ Set error message
    'Clear Success': emptyProps(),               // ✅ Clear success message
    'Clear Error': emptyProps(),                 // ❌ Clear error message
  }
});
