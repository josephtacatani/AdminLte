import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse, Token } from 'src/app/interfaces/auth.interfaces';
import { environment } from 'src/environments/environment.prod';
import { AuthActions } from 'src/app/auth/ngrx/login.actions';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private store: Store) {}

  // ✅ Login API
  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, loginRequest)
  }

  // ✅ Logout API call
  logoutApi(refreshToken: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/auth/logout`, { refreshToken });
  }

  refreshTokenApi(refreshToken: string): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/auth/refresh-token`, { refreshToken });
  }


}
