import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const AlertActions = createActionGroup({
  source: 'Alerts',
  events: {
'Set Success': props<{ message: string }>(),  // ✅ Set success message
    'Set Error': props<{ message: string }>(),    // ❌ Set error message
    'Set Warning': props<{ message: string }>(),  // ⚠️ Set warning message (NEW)
    'Set Info': props<{ message: string }>(),     // ℹ️ Set info message (NEW)
    'Clear Success': emptyProps(),                // ✅ Clear success message
    'Clear Error': emptyProps(),                  // ❌ Clear error message
    'Clear Warning': emptyProps(),                // ⚠️ Clear warning message (NEW)
    'Clear Info': emptyProps()                    // ℹ️ Clear info message (NEW)
    
  }
});
