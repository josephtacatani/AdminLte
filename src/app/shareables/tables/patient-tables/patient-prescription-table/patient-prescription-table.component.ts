import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DisplayTableComponent } from 'src/app/my-components/tables/display-table/display-table.component';
import { PrescriptionData } from 'src/app/interfaces/patients.interface';

@Component({
  selector: 'app-patient-prescription-table',
  standalone: true,
  imports: [CommonModule, DisplayTableComponent],
  templateUrl: './patient-prescription-table.component.html',
  styleUrls: ['./patient-prescription-table.component.scss']
})
export class PatientPrescriptionTableComponent {

    sortColumn: string = 'date'; // Default sort column
    sortDirection: string = 'asc'; // Default sort direction
  
  prescriptionData: PrescriptionData[] = [
    { date: '2023-01-01', medicine: 'Medicine A', notes: 'Take twice daily' },
    { date: '2023-01-02', medicine: 'Medicine B', notes: 'Take once daily' }
  ];
  
    filteredPrescriptionData: PrescriptionData[] = [...this.prescriptionData];
  
    columns = [
      { key: 'date', label: 'Date', sortable: true },
      { key: 'medicine', label: 'Medicine', sortable: true },
      { key: 'notes', label: 'Notes', sortable: true },
    ];
  
    itemsPerPage = 10;
    searchTerm = '';
    currentPage = 1;
  
    constructor(private router: Router) {}
  
    ngOnInit(): void {
      this.sortprescriptionData(this.sortColumn);
    }
  
    filterprescriptionData(search: string): void {
      this.searchTerm = search.trim(); // Trim unnecessary spaces
  
      if (this.searchTerm === '') {
        // Reset to full list if the search box is cleared
        this.filteredPrescriptionData = [...this.prescriptionData];
      } else {
        // Filter dynamically based on search term
        this.filteredPrescriptionData = this.prescriptionData.filter((prescription) =>
          Object.values(prescription)
            .join(' ')
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
        );
      }
    }
  
    sortprescriptionData(column: string): void {
      this.sortColumn = column;
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  
      this.filteredPrescriptionData.sort((a, b) => {
        const valA = (a as any)[column]?.toString().toLowerCase() || ''; // Access dynamically
        const valB = (b as any)[column]?.toString().toLowerCase() || '';
  
        return this.sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }
}
