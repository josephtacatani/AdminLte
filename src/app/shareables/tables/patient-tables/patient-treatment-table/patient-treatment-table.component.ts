import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DisplayTableComponent } from 'src/app/my-components/tables/display-table/display-table.component';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { Treatment } from 'src/app/interfaces/treatments.interface';
import { selectError, selectIsLoading, selectTreatmentsByPatient } from 'src/app/ngrx/treatments/treatments.reducers';
import { TreatmentActions } from 'src/app/ngrx/treatments/treatments.actions';


@Component({
  selector: 'app-patient-treatment-table',
  standalone: true,
  imports: [CommonModule, DisplayTableComponent],
  templateUrl: './patient-treatment-table.component.html',
  styleUrls: ['./patient-treatment-table.component.scss'],
})
export class PatientTreatmentTableComponent implements OnInit {
  pagetitle = 'Patient Treatments';

  // ✅ Fetch treatments from NgRx Store
  treatmentData$: Observable<Treatment[]> = this.store.pipe(select(selectTreatmentsByPatient));
  isLoading$: Observable<boolean> = this.store.pipe(select(selectIsLoading));
  errorMessage$: Observable<string | null> = this.store.pipe(select(selectError));

  // ✅ BehaviorSubjects for search term and sorting
  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();

  private sortColumnSubject = new BehaviorSubject<string>('date_visit');
  private sortDirectionSubject = new BehaviorSubject<'asc' | 'desc'>('asc');

  filteredTreatmentData$: Observable<Treatment[]>;

  

  columns = [
    { key: 'date_visit', label: 'Date Visit', sortable: true },
    { key: 'teeth', label: 'Teeth No.s', sortable: true },
    { key: 'treatment', label: 'Treatment', sortable: true },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'fees', label: 'Fees', sortable: true },
    { key: 'remarks', label: 'Remarks', sortable: true },
  ];

  itemsPerPage = 10;
  currentPage = 1;

  constructor(private route: ActivatedRoute, private router: Router, private store: Store) {
    // ✅ Combine Observables for filtering & sorting
    this.filteredTreatmentData$ = combineLatest([
      this.treatmentData$,
      this.searchTerm$,
      this.sortColumnSubject,
      this.sortDirectionSubject,
    ]).pipe(
      map(([treatments, searchTerm, sortColumn, sortDirection]) => {
        let filtered = treatments.map((treatment) => ({
          ...treatment,
          date_visit: formatDate(treatment.date_visit, 'MMMM d, y', 'en-US') // ✅ Convert to "January 12, 2000"
     }));
    
        // ✅ Filter treatments based on search
        if (searchTerm.trim()) {
          filtered = filtered.filter((treatment) =>
            Object.values(treatment)
              .join(' ')
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          );
        }
    
        // ✅ Sort filtered results
        return [...filtered].sort((a, b) => {
          let aValue = a[sortColumn as keyof Treatment] as string;
          let bValue = b[sortColumn as keyof Treatment] as string;
    
          return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        });
      })
    );

    this.filteredTreatmentData$.subscribe((data) => {
      console.log('Filtered Treatment Data from Component:', data);
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const patientId = Number(params.get('patientId'));

      if (!isNaN(patientId) && patientId > 0) {
        this.store.dispatch(TreatmentActions.loadTreatmentsByPatientId({ patientId }));
      } else {
        this.store.dispatch(TreatmentActions.loadTreatmentsByPatientIdFailure({ error: 'Invalid patient ID' }));
      }
    });
  }

  // ✅ Updates the search term for filtering
  filterTreatmentData(search: string): void {
    this.searchTermSubject.next(search.trim());
  }

  // ✅ Sorting function using BehaviorSubject
  sortTreatmentData(column: string): void {
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
