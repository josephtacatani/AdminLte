import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthActions } from '../ngrx/login.actions';
import { LoginRequest } from 'src/app/interfaces/auth.interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(private fb: FormBuilder, private store: Store) {}

  onLogin() {
    if (this.loginForm.invalid) return;

    const loginRequest: LoginRequest = {
      email: this.loginForm.get('email')?.value as string,  
      password: this.loginForm.get('password')?.value as string 
    };

    this.store.dispatch(AuthActions.login({ loginRequest }));
  }
}
