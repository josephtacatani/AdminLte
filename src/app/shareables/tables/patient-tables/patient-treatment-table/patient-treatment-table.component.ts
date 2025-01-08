import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentDetail, TreatmentData } from 'src/app/interfaces/patients.interface';
import { DisplayTableComponent } from 'src/app/my-components/tables/display-table/display-table.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-treatment-table',
  standalone: true,
  imports: [CommonModule, DisplayTableComponent],
  templateUrl: './patient-treatment-table.component.html',
  styleUrls: ['./patient-treatment-table.component.scss']
})
export class PatientTreatmentTableComponent {
  pagetitle = 'Patients';
  sortColumn: string = 'date'; // Default sort column
  sortDirection: string = 'asc'; // Default sort direction

  treatmentData: TreatmentData[] = [
    {
      dateVisit: '2023-10-01',
      teethNos: '12, 14',
      treatment: 'Filling',
      description: 'Composite filling',
      fees: '$200',
      remarks: 'Follow-up in 6 months'
    },
    {
      dateVisit: '2023-10-15',
      teethNos: '22',
      treatment: 'Extraction',
      description: 'Tooth extraction',
      fees: '$150',
      remarks: 'Healing well'
    }
  ];

  filteredtreatmentData: TreatmentData[] = [...this.treatmentData];

  columns = [
    { key: 'dateVisit', label: 'Date Visit', sortable: true }, // Corrected key
    { key: 'teethNos', label: 'Teeth No.s', sortable: true },  // Corrected key
    { key: 'treatment', label: 'Treatment', sortable: true },
    { key: 'description', label: 'Description', sortable: false },
    { key: 'fees', label: 'Fees', sortable: false },
    { key: 'remarks', label: 'Remarks', sortable: false },
  ];

  itemsPerPage = 10;
  searchTerm = '';
  currentPage = 1;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.sorttreatmentData(this.sortColumn);
  }

  filtertreatmentData(search: string): void {
    this.searchTerm = search.trim(); // Trim unnecessary spaces

    if (this.searchTerm === '') {
      // Reset to full list if the search box is cleared
      this.filteredtreatmentData = [...this.treatmentData];
    } else {
      // Filter dynamically based on search term
      this.filteredtreatmentData = this.treatmentData.filter((treatment) =>
        Object.values(treatment)
          .join(' ')
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase())
      );
    }
  }

  sorttreatmentData(column: string): void {
    this.sortColumn = column;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

    this.filteredtreatmentData.sort((a, b) => {
      const valA = (a as any)[column]?.toString().toLowerCase() || ''; // Access dynamically
      const valB = (b as any)[column]?.toString().toLowerCase() || '';

      return this.sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }
}
