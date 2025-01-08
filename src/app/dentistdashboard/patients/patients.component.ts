import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableComponent } from 'src/app/ashared/table/table.component';
import { Patient } from 'src/app/model-interfaces/patients.interface';


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

  originalPatients: Patient[] = [
    { id: 101, photo: 'assets/img/patient1.jpg', name: 'John Doe', birthday: '1990-01-01', gender: 'Male', contact: '123-456-7890', email: 'john.doe@example.com' },
    { id: 102, photo: 'assets/img/patient2.jpg', name: 'Jane Smith', birthday: '1985-05-15', gender: 'Female', contact: '987-654-3210', email: 'jane.smith@example.com' }
  ];

  filteredPatients: Patient[] = [...this.originalPatients];

  columns = [
    { key: 'photo', label: 'Photo', render: (data: any) => `<img src="${data}" class="img-thumbnail" width="50" alt="Photo">`, sortable: false },
    { key: 'name', label: 'Patient', sortable: true },
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

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.sortPatients(this.sortColumn);
  }
  filterPatients(search: string): void {
    this.searchTerm = search;
    this.filteredPatients = this.originalPatients.filter((patient) =>
      Object.values(patient).join(' ').toLowerCase().includes(search.toLowerCase())
    );
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
    console.log('Navigating to patient with ID:', patientId);
    this.router.navigate([`/dentistdashboard/patients/patient-details`, patientId]);
  }

  handleActionClick(event: { action: string; row: any }): void {
    if (event.action === 'view') {
      this.navigateToPatientDetails(event.row.id);
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
