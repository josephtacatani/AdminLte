import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store, select } from '@ngrx/store';
import { Observable, BehaviorSubject, combineLatest, map } from 'rxjs';
import { TableComponent } from 'src/app/my-components/tables/table/table.component';
import { Patient } from 'src/app/interfaces/patient_details.interface';
import { PatientsActions } from 'src/app/ngrx/patients/patients.actions';
import { selectPatients, selectIsLoading, selectError } from 'src/app/ngrx/patients/patients.reducers';
import { DisplayTableComponent } from 'src/app/my-components/tables/display-table/display-table.component';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {
  pagetitle = 'Patients';

  // ✅ Fetch patients from NgRx Store
  patients$: Observable<Patient[]> = this.store.pipe(select(selectPatients));
  isLoading$: Observable<boolean> = this.store.pipe(select(selectIsLoading));
  errorMessage$: Observable<string | null> = this.store.pipe(select(selectError));

  // ✅ BehaviorSubjects for search and sorting
  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();

  private sortColumnSubject = new BehaviorSubject<string>('fullname'); // Default sorting column
  private sortDirectionSubject = new BehaviorSubject<'asc' | 'desc'>('asc');

  filteredPatients$: Observable<Patient[]>;

  currentPage = 1;
  itemsPerPage = 10;

  columns = [
    { key: 'photo', label: 'Photo', render: (data: any) => `<img src="${data}" class="img-thumbnail" width="50" alt="Photo">`, sortable: false },
    { key: 'fullname', label: 'Name', sortable: true },
    { key: 'birthday', label: 'Birthday', sortable: true },
    { key: 'sex', label: 'Gender', sortable: true },
    { key: 'contact_number', label: 'Contact', sortable: false },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'action', label: 'Action', sortable: false }
  ];

  actions = [
    { label: 'View', icon: 'fas fa-eye', callback: 'view' }
  ];

  constructor(private router: Router, private store: Store) {
    // ✅ Combine Observables for filtering & sorting
    this.filteredPatients$ = combineLatest([
      this.patients$,
      this.searchTerm$,
      this.sortColumnSubject,
      this.sortDirectionSubject
    ]).pipe(
      map(([patients, searchTerm, sortColumn, sortDirection]) => {
        let filtered = this.filterPatients(patients, searchTerm);
        filtered = filtered.map(patient => ({
          ...patient,
          birthday: this.formatDate(patient.birthday),
        }));
        return this.sortPatients(filtered, sortColumn, sortDirection);
      })
    );
  }

  ngOnInit(): void {
    this.store.dispatch(PatientsActions.loadPatients()); // ✅ Dispatch action to load patients
  }

  // ✅ Format birthday
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  // ✅ Filter Patients based on search term
  private filterPatients(patients: Patient[], searchTerm: string): Patient[] {
    if (!searchTerm.trim()) return patients;
    return patients.filter((patient) =>
      `${patient.fullname} ${patient.email} ${patient.sex} ${patient.contact_number}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }

  // ✅ Sort Patients efficiently
  private sortPatients(
    patients: Patient[],
    sortColumn: string,
    sortDirection: 'asc' | 'desc'
  ): Patient[] {
    return [...patients].sort((a, b) => {
      const aValue = a[sortColumn as keyof Patient];
      const bValue = b[sortColumn as keyof Patient];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }

  // ✅ Getter for search term
  get searchTerm(): string {
    return this.searchTermSubject.getValue();
  }

  // 🔍 Updates the search term dynamically
  filterPatientsBySearch(search: string): void {
    this.searchTermSubject.next(search.trim());
  }

  // 📌 Sort patients by column
  sortPatientsByColumn(column: string): void {
    if (this.sortColumnSubject.getValue() === column) {
      this.sortDirectionSubject.next(this.sortDirectionSubject.getValue() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumnSubject.next(column);
      this.sortDirectionSubject.next('asc');
    }
  }

  handleRowAction(rowData: any): void {
    this.navigateToPatientDetails(rowData.user_id);
  }

  navigateToPatientDetails(patientId: number): void {
    this.router.navigate([`/dentistdashboard/patients/patient-details`, patientId]);
  }

  handleActionClick(event: { action: string; row: any }): void {
    if (event.action === 'view') {
      this.navigateToPatientDetails(event.row.user_id);
    }
  }
}
