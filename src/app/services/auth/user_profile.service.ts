import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginRequest, LoginResponse, Token } from 'src/app/interfaces/auth.interfaces';
import { UserProfileResponse } from 'src/app/interfaces/user_profile.interface';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
    private apiUrl = environment.apiUrl; 

  constructor(private http: HttpClient) {}

    // ✅ Fetch User Profile
    getProfile(): Observable<UserProfileResponse> {
        return this.http.get<UserProfileResponse>(`${this.apiUrl}/profile`);
      }
}
