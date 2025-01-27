import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DisplayTableComponent } from 'src/app/my-components/tables/display-table/display-table.component';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { selectPrescriptionsByPatient, selectIsLoading, selectError } from 'src/app/ngrx/prescription/prescription.reducers';
import { PrescriptionsActions } from 'src/app/ngrx/prescription/prescription.actions';
import { Prescription } from 'src/app/interfaces/prescription.interface';

@Component({
  selector: 'app-patient-prescription-table',
  standalone: true,
  imports: [CommonModule, DisplayTableComponent],
  templateUrl: './patient-prescription-table.component.html',
  styleUrls: ['./patient-prescription-table.component.scss'],
})
export class PatientPrescriptionTableComponent implements OnInit {
  pagetitle = 'Patient Prescriptions';

  // ✅ Fetch prescriptions from NgRx Store
  prescriptionData$: Observable<Prescription[]> = this.store.pipe(select(selectPrescriptionsByPatient));
  isLoading$: Observable<boolean> = this.store.pipe(select(selectIsLoading));
  errorMessage$: Observable<string | null> = this.store.pipe(select(selectError));

  // ✅ BehaviorSubjects for search term and sorting
  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();

  private sortColumnSubject = new BehaviorSubject<string>('date');
  private sortDirectionSubject = new BehaviorSubject<'asc' | 'desc'>('asc');

  filteredPrescriptionData$: Observable<Prescription[]>;

  columns = [
    { key: 'date', label: 'Date', sortable: true },
    { key: 'medicine', label: 'Medicine', sortable: true },
    { key: 'notes', label: 'Notes', sortable: true },
  ];

  itemsPerPage = 10;
  currentPage = 1;

  constructor(private route: ActivatedRoute, private router: Router, private store: Store) {
    // ✅ Combine Observables for filtering & sorting
    this.filteredPrescriptionData$ = combineLatest([
      this.prescriptionData$,
      this.searchTerm$,
      this.sortColumnSubject,
      this.sortDirectionSubject,
    ]).pipe(
      map(([prescriptions, searchTerm, sortColumn, sortDirection]) => {
        let filtered = prescriptions;

        // ✅ Filter prescriptions based on search
        if (searchTerm.trim()) {
          filtered = prescriptions.filter((prescription) =>
            Object.values(prescription)
              .join(' ')
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          );
        }

        // ✅ Format the date before displaying it in the table
        filtered = filtered.map((prescription) => ({
          ...prescription,
          date: this.formatDate(prescription.date), // Format date
        }));

        // ✅ Sort filtered results
        return [...filtered].sort((a, b) => {
          const aValue = a[sortColumn as keyof Prescription] as string;
          const bValue = b[sortColumn as keyof Prescription] as string;

          return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        });
      })
    );
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const patientId = Number(params.get('patientId'));
      console.log('Extracted patientId:', patientId); // ✅ Debugging log

      if (!isNaN(patientId) && patientId > 0) {
        console.log('Dispatching action: loadPrescriptionsByPatientId');
        this.store.dispatch(PrescriptionsActions.loadPrescriptionsByPatientId({ patientId }));
      } else {
        console.error('Invalid patient ID detected, dispatching failure action');
        this.store.dispatch(PrescriptionsActions.loadPrescriptionsByPatientIdFailure({ error: 'Invalid patient ID' }));
      }
    });
  }

  // ✅ Format date to a readable format
  private formatDate(dateString: string): string {
    if (!dateString) return ''; // Handle empty dates
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  // ✅ Updates the search term for filtering
  filterPrescriptionData(search: string): void {
    this.searchTermSubject.next(search.trim());
  }

  // ✅ Sorting function using BehaviorSubject
  sortPrescriptionData(column: string): void {
    if (this.sortColumnSubject.getValue() === column) {
      this.sortDirectionSubject.next(this.sortDirectionSubject.getValue() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumnSubject.next(column);
      this.sortDirectionSubject.next('asc');
    }
  }

  get searchTerm(): string {
    return this.searchTermSubject.getValue(); // ✅ Retrieves the current search term
  }
}
