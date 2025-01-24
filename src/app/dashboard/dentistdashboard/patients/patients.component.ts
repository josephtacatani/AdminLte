import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableComponent } from 'src/app/my-components/tables/table/table.component';
import { PatientDataService } from 'src/app/services/patients/patient-data-service';
import { PatientData } from 'src/app/interfaces/patients.interface';


@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {
  pagetitle = 'Patients';
  sortColumn: string = 'name'; // Default sort column
  sortDirection: string = 'asc'; // Default sort direction

  originalPatients: PatientData[] = [];
  filteredPatients: PatientData[] = [];
  errorMessage: string = '';

  columns = [
    { key: 'photo', label: 'Photo', render: (data: any) => `<img src="${data}" class="img-thumbnail" width="50" alt="Photo">`, sortable: false },
    { key: 'name', label: 'PatientData', sortable: true },
    { key: 'birthday', label: 'Birthday', sortable: true },
    { key: 'gender', label: 'Gender', sortable: true },
    { key: 'contact', label: 'Contact', sortable: false },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'action', label: 'Action', sortable: false }
  ];

  actions = [
    { label: 'View', icon: 'fas fa-eye', callback: 'view' }
  ];

  itemsPerPage = 10;
  searchTerm = '';
  currentPage = 1;

  constructor(private router: Router, private patientDataService: PatientDataService) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.patientDataService.getPatients().subscribe({
      next: (data: PatientData[]) => {
        this.originalPatients = data;
        this.filteredPatients = [...this.originalPatients];
        this.sortPatients(this.sortColumn); // Apply default sorting
      },
      error: (err) => {
        this.errorMessage = 'Failed to load patients.';
        console.error(err);
      }
    });
  }

  filterPatients(search: string): void {
    this.searchTerm = search.trim();
    if (!this.searchTerm) {
      this.filteredPatients = [...this.originalPatients];
    } else {
      this.filteredPatients = this.originalPatients.filter((patient) =>
        Object.values(patient)
          .join(' ')
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase())
      );
    }
  }

  sortPatients(column: string): void {
    this.sortColumn = column;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

    this.filteredPatients.sort((a: any, b: any) => {
      const valA = a[column]?.toString().toLowerCase() || '';
      const valB = b[column]?.toString().toLowerCase() || '';
      return this.sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }

  handleRowAction(rowData: any): void {
    this.navigateToPatientDetails(rowData.id);
  }

  navigateToPatientDetails(patientId: number): void {
    this.router.navigate([`/dentistdashboard/patients/patient-details`, patientId]);
  }

  handleActionClick(event: { action: string; row: any }): void {
    if (event.action === 'view') {
      this.navigateToPatientDetails(event.row.patientId);
    }
  }

  openEditPatientModal(patientId: number): void {
    console.log('Editing patient with ID:', patientId);
    // Open edit modal logic here
  }
  
  confirmDeletePatient(patientId: number): void {
    console.log('Deleting patient with ID:', patientId);
    // Confirm and delete logic here
  }
}
