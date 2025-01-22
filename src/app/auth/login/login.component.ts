import { Component, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AuthActions } from '../ngrx/login.actions';
import { LoginRequest } from 'src/app/interfaces/auth.interfaces';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { selectLoginError, selectLoginMessage } from '../ngrx/login.reducers';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loginMessage$: Observable<string | null> = this.store.pipe(select(selectLoginMessage));
  loginError$: Observable<string | null> = this.store.pipe(select(selectLoginError)); // ✅ No need for map()

  
  private subscriptions: Subscription = new Subscription();
  constructor(private fb: FormBuilder, private store: Store) {
        // ✅ Auto-dismiss success messages after 3 seconds
        this.loginMessage$.subscribe(message => {
          if (message) {
            setTimeout(() => {
              this.store.dispatch(AuthActions.clearMessage()); // ✅ Dispatch action to clear message
            }, 3000);
          }
        });
    
        // ✅ Auto-dismiss error messages after 3 seconds
        this.loginError$.subscribe(error => {
          if (error) {
            setTimeout(() => {
              this.store.dispatch(AuthActions.clearError()); // ✅ Dispatch action to clear error
            }, 3000);
          }
        });
  }

  onLogin() {
    if (this.loginForm.invalid) return;

    const loginRequest: LoginRequest = {
      email: this.loginForm.get('email')?.value as string,  
      password: this.loginForm.get('password')?.value as string 
    };

    this.store.dispatch(AuthActions.login({ loginRequest }));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe(); // ✅ Cleanup to avoid memory leaks
  }
}
