import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthActions } from './auth/ngrx/login.actions';
import { select, Store } from '@ngrx/store';
import { checkTokenExpiry } from './functions/token_expiry';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmModalComponent } from './my-components/modals/confirm-modal/confirm-modal.component';
import { defaultIfEmpty, map, Observable } from 'rxjs';
import { selectLogoutCountdown, selectShowTokenExpiryModal } from './auth/ngrx/login.reducers';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, NgSelectModule, ConfirmModalComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showTokenExpiryModal$: Observable<boolean>;
  logoutCountdown$: Observable<number | null>;

  constructor(private store: Store) {
    this.showTokenExpiryModal$ = this.store.pipe(
      select(selectShowTokenExpiryModal),
      defaultIfEmpty(false)
    );
    
    this.logoutCountdown$ = this.store.pipe(
      select(selectLogoutCountdown),
      defaultIfEmpty(60)
    );
  }

  onLogout(): void {
    this.store.dispatch(AuthActions.logout({ refreshToken: localStorage.getItem('refreshToken')! }));
  }

  onRefreshToken(): void {
    this.store.dispatch(AuthActions.refreshToken({ refreshToken: localStorage.getItem('refreshToken')! }));
  }
}
