import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ProfileActions } from './user_profile.actions';
import { ProfileService } from 'src/app/services/auth/user_profile.service';

@Injectable()
export class ProfileEffects {
  constructor(private actions$: Actions, private profileService: ProfileService) {}

  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.loadProfile),
      exhaustMap(() =>
        this.profileService.getProfile().pipe(
          map(profile => ProfileActions.loadProfileSuccess({ profile })),
          catchError(error => of(ProfileActions.loadProfileFailure({ error: error.message || 'Failed to load profile' })))
        )
      )
    )
  );
}
