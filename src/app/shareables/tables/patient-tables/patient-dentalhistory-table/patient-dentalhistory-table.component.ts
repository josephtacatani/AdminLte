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
  selectLoading, 
  selectMessageDental
} from 'src/app/ngrx/dental_history/dental_history.reducers';
import { DentalHistoryActions } from 'src/app/ngrx/dental_history/dental_history.actions';
import { TableWithEditDeleteComponent } from 'src/app/my-components/tables/table-with-edit-delete/table-with-edit-delete.component';
import { AddEditDentalHistoryComponent } from 'src/app/my-components/modals/add-edit-dental-history/add-edit-dental-history.component';
import { AlertComponent } from 'src/app/my-components/alert/alert.component';
import { ConfirmModalComponent } from 'src/app/my-components/modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-patient-dentalhistory-table',
  standalone: true,
  imports: [CommonModule, TableWithEditDeleteComponent, AddEditDentalHistoryComponent, AlertComponent, ConfirmModalComponent],
  templateUrl: './patient-dentalhistory-table.component.html',
  styleUrls: ['./patient-dentalhistory-table.component.scss'],
})
export class PatientDentalhistoryTableComponent implements OnInit {
  pagetitle = 'Patient Dental History';
  isAddDentalHistoryModalVisible = false;
  // ✅ Fetch dental history data from NgRx Store
  dentalHistories$: Observable<DentalHistory[]> = this.store.pipe(select(selectSelectedDentalHistoriesByPatientId));
  selectedDentalHistory$: Observable<DentalHistory | null> = this.store.pipe(select(selectSelectedDentalHistory)); // ✅ Fetch single history
  isLoading$: Observable<boolean> = this.store.pipe(select(selectLoading));
  errorMessage$: Observable<string | null> = this.store.pipe(select(selectError));
  selectDentalMessage$: Observable<string | null> = this.store.pipe(select(selectMessageDental));


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
  isConfirmModalVisible = false;
  confirmModalMessage = 'Are you sure you want to delete this dental history?';
  selectedDentalHistoryId: number | null = null;
  selectedPatientId: number | null = null;

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

    this.selectedDentalHistory$.subscribe(dentalHistory => {
      this.selectedDentalHistory = dentalHistory; // ✅ Store in local variable
    });

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


  editDentalHistory(dentalHistory: DentalHistory): void {
    this.isAddDentalHistoryModalVisible = true;
    this.modalTitle = 'Edit Dental History';
  
    if (dentalHistory.id !== undefined) {
      this.store.dispatch(DentalHistoryActions.loadDentalHistoryById({ id: dentalHistory.id }));
  
      // ✅ Delay modal opening to ensure data is loaded
      setTimeout(() => {
        this.isAddEditModalVisible = true;
        this.cdr.detectChanges(); // ✅ Force UI update
      }, 100);
    } else {
      console.error('Cannot edit dental history: ID is undefined');
    }
  }
  

  closeAddDentalHistoryModal(): void {
    console.log('Closing modal'); // Debugging output
    this.isAddDentalHistoryModalVisible = false;
    this.selectedDentalHistory = null;  // ✅ Reset selected data
    this.cdr.detectChanges(); // ✅ Force UI update
  }

  handleDentalHistorySubmit(dentalHistory: DentalHistory): void {
    console.log('Dental History Submitted:', dentalHistory); // Debugging output
  
    if (dentalHistory.id !== undefined) {
      this.store.dispatch(DentalHistoryActions.updateDentalHistory({ 
        id: dentalHistory.id, 
        dentalHistory 
      }));
  
      this.store.dispatch(DentalHistoryActions.loadDentalHistoriesByPatientId({ patientId: dentalHistory.patient_id }));
    } else {
      console.error('Error: Dental history ID is missing. Cannot update.');
    }
  
    // ✅ Ensure modal is closed
    this.closeAddDentalHistoryModal();
  }
  
  

  handleActionClick(event: { action: string; row: DentalHistory }): void {
    const { action, row } = event;
  
    if (action === 'edit') {
      
      this.editDentalHistory(row);
    } else if (action === 'delete') {
      if (row.id !== undefined && row.patient_id !== undefined) {
        // ✅ Store ID and Patient ID before showing modal
        this.selectedDentalHistoryId = row.id;
        this.selectedPatientId = row.patient_id;
        this.isConfirmModalVisible = true; // ✅ Show modal
      } else {
        console.error('Cannot delete dental history: ID or patient ID is undefined');
      }
    }
  }

  confirmDelete(): void {
    if (this.selectedDentalHistoryId !== null && this.selectedPatientId !== null) {
      this.store.dispatch(DentalHistoryActions.deleteDentalHistory({ 
        id: this.selectedDentalHistoryId
      }));
  
      // ✅ Close modal
      this.isConfirmModalVisible = false;
      this.store.dispatch(DentalHistoryActions.loadDentalHistoriesByPatientId({patientId: this.selectedPatientId}))

  
      // ✅ Reset selected values
      this.selectedDentalHistoryId = null;
      this.selectedPatientId = null;
    }
  }
  
  

  deleteDentalHistory(id: number): void {
    this.store.dispatch(DentalHistoryActions.deleteDentalHistory({ id }));
    this.route.paramMap.subscribe(params => {
      const patientId = Number(params.get('patientId'));
  
      if (!isNaN(patientId) && patientId > 0) {
        this.store.dispatch(DentalHistoryActions.loadDentalHistoriesByPatientId( {patientId: patientId} ));
      } else {
        console.error('Cannot delete dental history: Patient ID is missing in URL');
      }
    });
  }

  get searchTerm(): string {
    return this.searchTermSubject.getValue();
  }
}
