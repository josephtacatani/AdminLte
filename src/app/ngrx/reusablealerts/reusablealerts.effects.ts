import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { delay, map } from 'rxjs/operators';
import { AlertActions } from './reusablealerts.actions';

@Injectable()
export class AlertEffects {
  constructor(private actions$: Actions) {}

  // ✅ Auto-clear success message after 3 seconds
  clearSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertActions.setSuccess),
      delay(3000), // ⏳ Wait for 3 seconds
      map(() => AlertActions.clearSuccess())
    )
  );

  // ❌ Auto-clear error message after 3 seconds
  clearError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertActions.setError),
      delay(3000), // ⏳ Wait for 3 seconds
      map(() => AlertActions.clearError())
    )
  );
}
