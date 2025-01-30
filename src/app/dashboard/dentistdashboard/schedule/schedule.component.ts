import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { Schedule } from 'src/app/interfaces/schedule.interface';
import { selectSchedulesByDentistId, selectSelectedSchedule, selectError, selectIsLoading, selectMessage } from 'src/app/ngrx/schedules/schedules.reducers';
import { ScheduleActions } from 'src/app/ngrx/schedules/schedule.actions';
import { TableWithEditDeleteComponent } from 'src/app/my-components/tables/table-with-edit-delete/table-with-edit-delete.component';
import { AlertComponent } from 'src/app/my-components/alert/alert.component';
import { ConfirmModalComponent } from 'src/app/my-components/modals/confirm-modal/confirm-modal.component';
import { GeneralModalComponent } from 'src/app/my-components/modals/general-modal/general-modal.component';
import { decodeAccessToken } from 'src/app/services/auth/auth.utils';

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
  isConfirmModalVisible = false;
  confirmModalMessage = 'Are you sure you want to delete this schedule?';
  isLoading$: Observable<boolean> = this.store.pipe(select(selectIsLoading));
  errorMessage$: Observable<string | null> = this.store.pipe(select(selectError));
  message$: Observable<string | null> = this.store.pipe(select(selectMessage));
  schedules$: Observable<Schedule[]> = this.store.pipe(select(selectSchedulesByDentistId));
  selectedSchedule$: Observable<Schedule | null> = this.store.pipe(select(selectSelectedSchedule));
  selectedSchedule: Schedule | null = null;
  dentistId: number | null = null;
  title: string= '';

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

  constructor(private route: ActivatedRoute, private store: Store, private cdr: ChangeDetectorRef) {
    this.filteredSchedules$ = combineLatest([
      this.schedules$,
      this.searchTerm$,
      this.sortColumnSubject,
      this.sortDirectionSubject,
    ]).pipe(
      map(([schedules, searchTerm, sortColumn, sortDirection]) => {
        let filtered = schedules.map((schedule) => ({
          ...schedule,
          date: formatDate(schedule.date, 'MMMM d, y', 'en-US'), // Format date
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

    this.selectedSchedule$.subscribe(schedule => {
      this.selectedSchedule = schedule; // Store in local variable
    });
  }

  ngOnInit(): void {    const userData = decodeAccessToken();
    if (userData?.id) {
      this.dentistId = userData.id
      this.store.dispatch(ScheduleActions.loadSchedulesByDentist({dentistId: this.dentistId}))
    } else {
      console.warn('No user ID found in token!');
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
      this.editSchedule(row);
    } else if (action === 'delete') {
      this.selectedSchedule = row;
      this.isConfirmModalVisible = true;
    }
  }

  editSchedule(schedule: Schedule): void {
    this.title = 'Edit Schedule';
    this.selectedSchedule = schedule; // Ensure the selected schedule is passed to the modal
    this.isAddScheduleModalVisible = true;
    this.store.dispatch(ScheduleActions.loadScheduleById({ schedule_id: schedule.id }));
  }
  

  closeAddScheduleModal(): void {
    this.isAddScheduleModalVisible = false;
    this.selectedSchedule = null;
    this.cdr.detectChanges();
  }

  handleAddSchedule(schedule: Schedule): void {
    if (this.title === 'Edit Schedule' && schedule.id) {
      // This is an edit, so we update the schedule
      this.store.dispatch(ScheduleActions.updateSchedule({ schedule_id: schedule.id, updateSchedule: { ...schedule } }));
    } else {
      // This is a create, so we create the schedule
      if (this.dentistId !== null && this.dentistId !== undefined) {
        this.store.dispatch(ScheduleActions.createSchedule({
          createSchedule: {
            dentist_id: this.dentistId,
            date: schedule.date,
            start_time: schedule.start_time,
            end_time: schedule.end_time,
          }
        }));
      } else {
        console.error('Incorrect dentist id');
      }
    }
  
    // Close modal after the action
    this.closeAddScheduleModal();
  }
  

  deleteSchedule(): void {
    if (this.selectedSchedule?.id) {
      this.store.dispatch(ScheduleActions.deleteSchedule({ id: this.selectedSchedule.id }));
      this.isConfirmModalVisible = false;
      this.store.dispatch(ScheduleActions.loadSchedulesByDentist({ dentistId: this.selectedSchedule.dentist_id }));
    }
  }

  openAddScheduleModal(){
    this.title = 'Add Schedule'; 
    this.isAddScheduleModalVisible = true;
  }
  get searchTerm(): string {
    return this.searchTermSubject.getValue();
  }
}
