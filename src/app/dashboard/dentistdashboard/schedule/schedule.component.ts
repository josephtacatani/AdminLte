import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { BehaviorSubject, combineLatest, filter, map, Observable, take } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { Schedule } from 'src/app/interfaces/schedule.interface';
import { 
  selectSchedulesByDentistId, 
  selectSelectedSchedule, 
  selectError, 
  selectIsLoading, 
  selectMessage 
} from 'src/app/ngrx/schedules/schedules.reducers';
import { ScheduleActions } from 'src/app/ngrx/schedules/schedule.actions';
import { TableWithEditDeleteComponent } from 'src/app/my-components/tables/table-with-edit-delete/table-with-edit-delete.component';
import { AlertComponent } from 'src/app/my-components/alert/alert.component';
import { ConfirmModalComponent } from 'src/app/my-components/modals/confirm-modal/confirm-modal.component';
import { GeneralModalComponent } from 'src/app/my-components/modals/general-modal/general-modal.component';
import { decodeAccessToken } from 'src/app/services/auth/auth.utils';
import { TokenService } from 'src/app/ngrx/schedules/token.service';
import { DecodeTokenService } from 'src/app/services/auth/decode.token.service';

@Component({
  selector: 'app-schedule-table',
  standalone: true,
  imports: [CommonModule, TableWithEditDeleteComponent, AlertComponent, ConfirmModalComponent, GeneralModalComponent],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  pagetitle = 'Schedule';
  isAddScheduleModalVisible = false;
  isEditScheduleModalVisible = false;
  isConfirmModalVisible = false;
  confirmModalMessage = 'Are you sure you want to delete this schedule?';
  
  isLoading$: Observable<boolean> = this.store.pipe(select(selectIsLoading));
  errorMessage$: Observable<string | null> = this.store.pipe(select(selectError));
  message$: Observable<string | null> = this.store.pipe(select(selectMessage));
  schedules$: Observable<Schedule[]> = this.store.pipe(select(selectSchedulesByDentistId));
  selectedSchedule$: Observable<Schedule | null> = this.store.pipe(select(selectSelectedSchedule));

  selectedSchedule: Schedule | null = null;
  dentistId: number | null = null;

  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();
  private sortColumnSubject = new BehaviorSubject<string>('date');
  private sortDirectionSubject = new BehaviorSubject<'asc' | 'desc'>('asc');

  filteredSchedules$: Observable<Schedule[]>;

  columns = [
    { key: 'date', label: 'Date', sortable: true },
    { key: 'start_time', label: 'Start Time', sortable: true },
    { key: 'end_time', label: 'End Time', sortable: true },
    { key: 'action', label: 'Action', sortable: false },
  ];

  itemsPerPage = 10;
  currentPage = 1;

  constructor(
    private store: Store, 
    private cdr: ChangeDetectorRef,
    private tokenService: TokenService,
    private decodeTokenService: DecodeTokenService
  ) {
    this.filteredSchedules$ = combineLatest([
      this.schedules$,
      this.searchTerm$,
      this.sortColumnSubject,
      this.sortDirectionSubject,
    ]).pipe(
      map(([schedules, searchTerm, sortColumn, sortDirection]) => {
        let filtered = schedules.map((schedule) => ({
          ...schedule,
          date: formatDate(schedule.date, 'MMMM d, y', 'en-US'),
        }));

        if (searchTerm.trim()) {
          filtered = filtered.filter((schedule) =>
            Object.values(schedule)
              .join(' ')
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          );
        }

        return [...filtered].sort((a, b) => {
          let aValue = a[sortColumn as keyof Schedule] as string;
          let bValue = b[sortColumn as keyof Schedule] as string;
          return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        });
      })
    );

    this.store.pipe(
      select(selectMessage),
      filter(message => !!message)
    ).subscribe(() => {
      if (this.dentistId) {
        this.store.dispatch(ScheduleActions.loadSchedulesByDentist({ dentistId: this.dentistId }));
      }
    });
  }

  ngOnInit(): void {
    this.dentistId = this.decodeTokenService.getUserId();
    if(this.dentistId){
      this.tokenService.loadSchedulesByDentist(this.dentistId)
    }
  }

  filterSchedules(search: string): void {
    this.searchTermSubject.next(search.trim());
  }

  sortSchedules(column: string): void {
    if (this.sortColumnSubject.getValue() === column) {
      this.sortDirectionSubject.next(this.sortDirectionSubject.getValue() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumnSubject.next(column);
      this.sortDirectionSubject.next('asc');
    }
  }

  handleActionClick(event: { action: string; row: Schedule }): void {
    const { action, row } = event;

    if (action === 'edit') {
      this.openEditScheduleModal(row);
    } else if (action === 'delete') {
      this.selectedSchedule = row;
      this.isConfirmModalVisible = true;
    }
  }

  // ✅ Add Schedule
  openAddScheduleModal(): void {
    this.selectedSchedule = null;
    this.isAddScheduleModalVisible = true;
  }

  handleAddSchedule(schedule: Schedule): void {
    if (this.dentistId) {
      this.store.dispatch(ScheduleActions.createSchedule({
        createSchedule: {
          dentist_id: this.dentistId,
          date: schedule.date,
          start_time: schedule.start_time,
          end_time: schedule.end_time,
        }
      }));
    }
    this.closeScheduleModal();
  }

  openEditScheduleModal(schedule: Schedule): void {
    this.isEditScheduleModalVisible = true;
    this.selectedSchedule = null; // Clear previous data
    this.store.dispatch(ScheduleActions.loadScheduleById({ schedule_id: schedule.id }));
  
    this.selectedSchedule$ = this.store.pipe(
      select(selectSelectedSchedule),
      filter(schedule => !!schedule), // Ensure we get a valid schedule
      take(1) // Automatically unsubscribe after receiving data
    );
  
    this.selectedSchedule$.subscribe((loadedSchedule) => {
      this.selectedSchedule = loadedSchedule;
      this.cdr.detectChanges(); // Ensure UI updates
    });
  }
  

  handleEditSchedule(schedule: Schedule): void {
    console.log('Submitting Edited Schedule:', schedule); // Debug #1
  
    if (schedule.id) {
      this.store.dispatch(ScheduleActions.updateSchedule({ 
        schedule_id: schedule.id, 
        updateSchedule: { ...schedule } 
      }));
      console.log('Dispatched Update Schedule Action:', schedule.id); // Debug #2
    } else {
      console.warn('Schedule ID is missing, update not dispatched!'); // Debug #3
    }
    
    this.closeScheduleModal();
  }
  

  // ✅ Delete Schedule
  deleteSchedule(): void {
    if (this.selectedSchedule?.id) {
      this.store.dispatch(ScheduleActions.deleteSchedule({ id: this.selectedSchedule.id }));
      this.isConfirmModalVisible = false;
    }
  }

  // ✅ Modal Management
  closeScheduleModal(): void {
    this.isAddScheduleModalVisible = false;
    this.isEditScheduleModalVisible = false;
    this.selectedSchedule = null;
    this.cdr.detectChanges();
  }

  get searchTerm(): string {
    return this.searchTermSubject.getValue();
  }
}
