import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { LoginRequest, LoginResponse } from 'src/app/interfaces/auth.interfaces';


export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login': props<{ loginRequest: LoginRequest }>(),
    'Login Success': props<{ loginResponse: LoginResponse }>(),
    'Login Failure': props<{ error: string }>(),
    'Refresh Token': props<{ refreshToken: string  }>(),
    'Refresh Token Success': props<{ message: string  }>(),
    'Refresh Token Failure': props<{ error: string }>(), 
    'Logout': props<{ refreshToken: string  }>(),
    'Logout Success': props<{ message: string  }>(),
    'Logout Failure': props<{ error: string }>(), // 
  }
});
