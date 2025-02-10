import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ScheduleActions } from './schedule.actions';


@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(private readonly store: Store) {}

  loadSchedulesByDentist(dentistId: number): void {
    this.store.dispatch(ScheduleActions.loadSchedulesByDentist({ dentistId }));
  }
}
