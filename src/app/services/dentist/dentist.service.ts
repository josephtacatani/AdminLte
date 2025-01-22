import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment.prod';
import { Dentist, DentistResponse, DentistsListResponse } from 'src/app/interfaces/dentist.interface';

@Injectable({
  providedIn: 'root',
})
export class DentistService {
  private apiUrl = `${environment.apiUrl}/dentist`; // ✅ Base API URL

  constructor(private http: HttpClient) {}

  // ✅ Get all dentists
  getDentists(): Observable<DentistsListResponse> {
    return this.http.get<DentistsListResponse>(this.apiUrl);
  }

  // ✅ Get a specific dentist by ID
  getDentistById(id: number): Observable<DentistResponse> {
    return this.http.get<DentistResponse>(`${this.apiUrl}/${id}`);
  }

  // ✅ Create a new dentist (Admin only)
  createDentist(dentistData: Partial<Dentist>): Observable<DentistResponse> {
    return this.http.post<DentistResponse>(this.apiUrl, dentistData);
  }

  // ✅ Update a dentist’s information
  updateDentist(id: number, updateData: Partial<Dentist>): Observable<DentistResponse> {
    return this.http.put<DentistResponse>(`${this.apiUrl}/${id}`, updateData);
  }

  // ✅ Delete a dentist (Admin only)
  deleteDentist(id: number): Observable<DentistResponse> {
    return this.http.delete<DentistResponse>(`${this.apiUrl}/${id}`);
  }
}
