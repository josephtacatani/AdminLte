import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PrescriptionData } from 'src/app/interfaces/patients.interface'; // Adjust the path if necessary

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {
  private apiUrl = 'http://localhost:3000/prescriptions'; // Your endpoint

  constructor(private http: HttpClient) {}

  // Get all prescriptions
  getPrescriptions(): Observable<PrescriptionData[]> {
    return this.http.get<PrescriptionData[]>(this.apiUrl);
  }

  // Add a new prescription
  addPrescription(prescription: PrescriptionData): Observable<PrescriptionData> {
    return this.http.post<PrescriptionData>(this.apiUrl, prescription);
  }

  // Update an existing prescription
  updatePrescription(id: number, prescription: PrescriptionData): Observable<PrescriptionData> {
    return this.http.put<PrescriptionData>(`${this.apiUrl}/${id}`, prescription);
  }

  // Delete a prescription
  deletePrescription(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
