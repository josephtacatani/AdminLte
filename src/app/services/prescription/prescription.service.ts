import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Prescription, PrescriptionResponse, PrescriptionsResponse } from 'src/app/interfaces/prescription.interface';

@Injectable({ providedIn: 'root' })
export class PrescriptionsService {
  private apiUrl = `${environment.apiUrl}/prescriptions`;

  constructor(private http: HttpClient) {}

  getPrescriptions(): Observable<PrescriptionsResponse> {
    return this.http.get<PrescriptionsResponse>(this.apiUrl);
  }

  getPrescriptionById(id: number): Observable<PrescriptionResponse> {
    return this.http.get<PrescriptionResponse>(`${this.apiUrl}/${id}`);
  }

  getPrescriptionsByPatientId(patientId: number): Observable<PrescriptionsResponse> {
    return this.http.get<PrescriptionsResponse>(`${this.apiUrl}/patient/${patientId}`);
  }

  createPrescription(prescription: Omit<Prescription, 'id' | 'created_at' | 'updated_at'>): Observable<PrescriptionResponse> {
    return this.http.post<PrescriptionResponse>(this.apiUrl, prescription);
  }

  updatePrescription(id: number, prescription: Partial<Omit<Prescription, 'created_at' | 'updated_at'>>): Observable<PrescriptionResponse> {
    return this.http.put<PrescriptionResponse>(`${this.apiUrl}/${id}`, prescription);
  }

  deletePrescription(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
