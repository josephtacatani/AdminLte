import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DentalHistoryData } from 'src/app/interfaces/patients.interface';

@Injectable({
  providedIn: 'root',
})
export class DentalHistoryService {
  private apiUrl = 'http://localhost:3000/dentalHistories'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  // Fetch dental history for a specific patient
  getDentalHistoryByPatientId(patientId: number): Observable<DentalHistoryData[]> {
    return this.http.get<DentalHistoryData[]>(`${this.apiUrl}?patientId=${patientId}`);
  }

  // Add a new dental history record
  addDentalHistory(dentalHistory: DentalHistoryData): Observable<DentalHistoryData> {
    return this.http.post<DentalHistoryData>(this.apiUrl, dentalHistory).pipe(
      map((response) => ({
        ...response,
        id: Number(response.id), // Convert id to number
      }))
    );
  }

  // Update an existing dental history record
  updateDentalHistory(id: number, dentalHistory: DentalHistoryData): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dentalHistory);
  }

  // Delete a dental history record
  deleteDentalHistory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAllDentalHistories(): Observable<DentalHistoryData[]> {
    return this.http.get<DentalHistoryData[]>(`${this.apiUrl}`);
  }
}
