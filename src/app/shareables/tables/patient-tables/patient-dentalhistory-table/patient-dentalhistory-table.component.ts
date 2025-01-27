import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { DentalHistory } from 'src/app/interfaces/dental_history.interface';
import { 
  selectSelectedDentalHistoriesByPatientId, 
  selectSelectedDentalHistory, // ✅ Add this selector
  selectError, 
  selectLoading 
} from 'src/app/ngrx/dental_history/dental_history.reducers';
import { DentalHistoryActions } from 'src/app/ngrx/dental_history/dental_history.actions';
import { TableWithEditDeleteComponent } from 'src/app/my-components/tables/table-with-edit-delete/table-with-edit-delete.component';
import { AddEditDentalHistoryComponent } from 'src/app/my-components/modals/add-edit-dental-history/add-edit-dental-history.component';

@Component({
  selector: 'app-patient-dentalhistory-table',
  standalone: true,
  imports: [CommonModule, TableWithEditDeleteComponent, AddEditDentalHistoryComponent],
  templateUrl: './patient-dentalhistory-table.component.html',
  styleUrls: ['./patient-dentalhistory-table.component.scss'],
})
export class PatientDentalhistoryTableComponent implements OnInit {
  pagetitle = 'Patient Dental History';

  // ✅ Fetch dental history data from NgRx Store
  dentalHistories$: Observable<DentalHistory[]> = this.store.pipe(select(selectSelectedDentalHistoriesByPatientId));
  selectedDentalHistory$: Observable<DentalHistory | null> = this.store.pipe(select(selectSelectedDentalHistory)); // ✅ Fetch single history
  isLoading$: Observable<boolean> = this.store.pipe(select(selectLoading));
  errorMessage$: Observable<string | null> = this.store.pipe(select(selectError));

  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();

  private sortColumnSubject = new BehaviorSubject<string>('last_dentist_visit');
  private sortDirectionSubject = new BehaviorSubject<'asc' | 'desc'>('asc');

  filteredDentalHistories$: Observable<DentalHistory[]>;

  columns = [
    { key: 'previous_dentist', label: 'Previous Dentist', sortable: true },
    { key: 'last_dentist_visit', label: 'Last Dental Visit', sortable: true },
    { key: 'action', label: 'Action', sortable: false },
  ];

  itemsPerPage = 10;
  currentPage = 1;
  isAddEditModalVisible = false;
  modalTitle = '';
  selectedDentalHistory: DentalHistory | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private store: Store, private cdr: ChangeDetectorRef) {
    this.filteredDentalHistories$ = combineLatest([
      this.dentalHistories$,
      this.searchTerm$,
      this.sortColumnSubject,
      this.sortDirectionSubject,
    ]).pipe(
      map(([dentalHistories, searchTerm, sortColumn, sortDirection]) => {
        let filtered = dentalHistories.map((history) => ({
          ...history,
          last_dentist_visit: formatDate(history.last_dentist_visit, 'MMMM d, y', 'en-US'), // ✅ Format date
        }));

        if (searchTerm.trim()) {
          filtered = filtered.filter((history) =>
            Object.values(history)
              .join(' ')
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          );
        }

        return [...filtered].sort((a, b) => {
          let aValue = a[sortColumn as keyof DentalHistory] as string;
          let bValue = b[sortColumn as keyof DentalHistory] as string;
          return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        });
      })
    );
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const patientId = Number(params.get('patientId'));
      if (!isNaN(patientId) && patientId > 0) {
        this.store.dispatch(DentalHistoryActions.loadDentalHistoriesByPatientId({ patientId }));
      } else {
        this.store.dispatch(DentalHistoryActions.loadDentalHistoriesByPatientIdFailure({ error: 'Invalid patient ID' }));
      }
    });

    // ✅ Subscribe to state changes and trigger change detection
    this.filteredDentalHistories$.subscribe(data => {
      console.log('Updated dental histories:', data);
      this.cdr.detectChanges(); // ✅ Force UI update
    });
  }

  filterDentalHistories(search: string): void {
    this.searchTermSubject.next(search.trim());
  }

  sortDentalHistories(column: string): void {
    if (this.sortColumnSubject.getValue() === column) {
      this.sortDirectionSubject.next(this.sortDirectionSubject.getValue() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumnSubject.next(column);
      this.sortDirectionSubject.next('asc');
    }
  }

  openAddEditModal(): void {
    this.modalTitle = 'Add Dental History';
    this.selectedDentalHistory = null;
    this.isAddEditModalVisible = true;
  }

  editDentalHistory(dentalHistory: DentalHistory): void {
    this.modalTitle = 'Edit Dental History';

    if (dentalHistory.id !== undefined) {
      // ✅ Dispatch action to load dental history by ID
      this.store.dispatch(DentalHistoryActions.loadDentalHistoryById({ id: dentalHistory.id }));
      this.isAddEditModalVisible = true;
    } else {
      console.error('Cannot edit dental history: ID is undefined');
    }
  }

  closeAddDentalHistoryModal(): void {
    this.isAddEditModalVisible = false;
  }

  handleDentalHistorySubmit(dentalHistory: DentalHistory): void {
    console.log('Dental History Submitted:', dentalHistory); // Debugging output
  
    if (dentalHistory.id !== undefined) {
      // ✅ Dispatch correctly by passing `id` and `dentalHistory`
      this.store.dispatch(DentalHistoryActions.updateDentalHistory({ 
        id: dentalHistory.id, 
        dentalHistory: { 
          patient_id: dentalHistory.patient_id,
          previous_dentist: dentalHistory.previous_dentist, 
          last_dentist_visit: dentalHistory.last_dentist_visit 
        } // Only send updatable fields
      }));
    } else {
      console.error('Error: Dental history ID is missing. Cannot update.');
    }
  
    this.closeAddDentalHistoryModal();
  }
  

  handleActionClick(event: { action: string; row: DentalHistory }): void {
    const { action, row } = event;

    if (action === 'edit') {
      this.editDentalHistory(row); // ✅ Call edit function
    } else if (action === 'delete') {
      if (row.id !== undefined) {
        this.deleteDentalHistory(row.id);
      } else {
        console.error('Cannot delete dental history: ID is undefined');
      }
    }
  }

  deleteDentalHistory(id: number): void {
    this.store.dispatch(DentalHistoryActions.deleteDentalHistory({ id }));
  }

  get searchTerm(): string {
    return this.searchTermSubject.getValue();
  }
}
