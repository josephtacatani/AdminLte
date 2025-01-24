import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Patient, PatientResponse, PatientsListResponse } from 'src/app/interfaces/patient_details.interface';

@Injectable({
  providedIn: 'root',
})
export class PatientsService {
  private apiUrl = `${environment.apiUrl}`; // ✅ Ensure correct endpoint

  constructor(private http: HttpClient) {}

  // ✅ Get all patients
  getPatients(): Observable<PatientsListResponse> {
    return this.http.get<PatientsListResponse>(this.apiUrl);
  }

  // ✅ Get a specific patient by user ID
  getPatientByUserId(id: number): Observable<PatientResponse> {
    return this.http.get<PatientResponse>(`${this.apiUrl}/patients/${id}`).pipe(
      tap(response => console.log('API Response:', response)), // ✅ Debug output
      catchError(error => throwError(() => new Error(error.error?.message || 'Error fetching patient')))
    );
  }

  // ✅ Update a patient's information
  updatePatient(id: number, updateData: Partial<Patient>): Observable<PatientResponse> {
    return this.http.put<PatientResponse>(`${this.apiUrl}/${id}`, updateData);
  }
}
