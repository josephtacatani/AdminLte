import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PatientData } from 'src/app/interfaces/patients.interface'; // Ensure correct path

@Injectable({
  providedIn: 'root'
})
export class PatientDataService {
  private apiUrl = 'http://localhost:3000/patients'; // Endpoint for patient data

  constructor(private http: HttpClient) {}

  // Get all patient data
  getPatients(): Observable<PatientData[]> {
    return this.http.get<PatientData[]>(this.apiUrl);
  }

  // Add a new patient
  addPatient(patient: PatientData): Observable<PatientData> {
    return this.http.post<PatientData>(this.apiUrl, patient);
  }

  // Update an existing patient
  updatePatient(id: number, patient: PatientData): Observable<PatientData> {
    return this.http.put<PatientData>(`${this.apiUrl}/${id}`, patient);
  }

  // Delete a patient
  deletePatient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
