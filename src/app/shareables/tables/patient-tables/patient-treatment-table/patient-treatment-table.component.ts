import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreatmentData } from 'src/app/interfaces/patients.interface';
import { DisplayTableComponent } from 'src/app/my-components/tables/display-table/display-table.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientTreatmentService } from 'src/app/services/patients/patient-treatment.service';

@Component({
  selector: 'app-patient-treatment-table',
  standalone: true,
  imports: [CommonModule, DisplayTableComponent],
  templateUrl: './patient-treatment-table.component.html',
  styleUrls: ['./patient-treatment-table.component.scss']
})
export class PatientTreatmentTableComponent implements OnInit {
  pagetitle = 'Patients';
  sortColumn: string = 'dateVisit'; // Default sort column
  sortDirection: string = 'asc'; // Default sort direction

  treatmentData: TreatmentData[] = [];
  filteredtreatmentData: TreatmentData[] = [];
  errorMessage: string = '';
  patientId: number | null = null;

  columns = [
    { key: 'dateVisit', label: 'Date Visit', sortable: true },
    { key: 'teethNos', label: 'Teeth No.s', sortable: true },
    { key: 'treatment', label: 'Treatment', sortable: true },
    { key: 'description', label: 'Description', sortable: false },
    { key: 'fees', label: 'Fees', sortable: false },
    { key: 'remarks', label: 'Remarks', sortable: false },
  ];

  itemsPerPage = 10;
  searchTerm = '';
  currentPage = 1;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private patientTreatmentService: PatientTreatmentService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id')); // Extract patient ID from route
      if (id) {
        this.patientId = id;
        this.loadTreatmentData(id); // Load treatment data for the specific patient
      } else {
        this.errorMessage = 'Invalid patient ID.';
      }
    });
  }

  loadTreatmentData(patientId: number): void {
    this.patientTreatmentService.getTreatments().subscribe({
      next: (data: TreatmentData[]) => {
        // Filter treatments specific to the patient by patientId
        this.treatmentData = data.filter((treatment) => treatment.patientId === patientId);
        this.filteredtreatmentData = [...this.treatmentData];
        this.sorttreatmentData(this.sortColumn);
      },
      error: (err) => {
        this.errorMessage = 'Failed to load treatment data.';
        console.error(err);
      }
    });
  }

  filtertreatmentData(search: string): void {
    this.searchTerm = search.trim();

    if (this.searchTerm === '') {
      this.filteredtreatmentData = [...this.treatmentData];
    } else {
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
      const valA = (a as any)[column]?.toString().toLowerCase() || '';
      const valB = (b as any)[column]?.toString().toLowerCase() || '';

      return this.sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }
}
