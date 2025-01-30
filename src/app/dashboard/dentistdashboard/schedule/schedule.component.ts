import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { GeneralModalComponent } from 'src/app/my-components/modals/general-modal/general-modal.component';
import { TableComponent } from 'src/app/my-components/tables/table/table.component';
import { Store, select } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { selectError, selectIsLoading, selectMessage, selectSchedules, selectSchedulesByDentistId, selectSelectedSchedule } from 'src/app/ngrx/schedules/schedules.reducers';
import { Schedule } from 'src/app/interfaces/schedule.interface';
import { ScheduleActions } from 'src/app/ngrx/schedules/schedule.actions';
import { EditDeleteTableComponent } from 'src/app/my-components/tables/edit_delete_tables/edit_delete_table';
import { TableWithEditDeleteComponent } from "../../../my-components/tables/table-with-edit-delete/table-with-edit-delete.component";


@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, GeneralModalComponent, NgxPaginationModule, TableWithEditDeleteComponent],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  pagetitle = 'Schedule';
  isAddScheduleModalVisible: boolean = false;
  itemsPerPage: number = 10;
  p: number = 1; // Current page number
  searchTerm: string = '';
  sortColumn: string = 'date';
  sortDirection: string = 'asc';
  selectSelectedScheduleById: number | null = null;
  modalTitle = '';

  message$: Observable<string | null> = this.store.pipe(select(selectMessage));
  error$: Observable<string | null> = this.store.pipe(select(selectError));
  schedules$: Observable<Schedule[] | null> = this.store.pipe(select(selectSchedulesByDentistId),
  map(schedules => schedules || []));

  scheduleById$: Observable<Schedule | null> = this.store.pipe(select(selectSelectedSchedule),
  map(scheduleById => scheduleById || ({} as Schedule)));

  isLoading$: Observable<boolean | null> = this.store.pipe(select(selectIsLoading));
  constructor(private store: Store) {

  }

  columns = [
    { key: 'date', label: 'Date', sortable: true },
    { key: 'start_time', label: 'Start Time', sortable: true },
    { key: 'end_time', label: 'End Time', sortable: true },
    { key: 'action', label: 'Action', sortable: false },
  ];

  ngOnInit(): void {
    this.store.dispatch(ScheduleActions.loadSchedulesByDentist({dentistId: 39}))
  }
  


  openAddScheduleModal(): void {
    this.isAddScheduleModalVisible = true;
    this.modalTitle = 'Add Schedule';
    this.scheduleById$ = this.store.pipe(map(() => null)); // Reset form
  }

  closeAddScheduleModal(): void {
    this.isAddScheduleModalVisible = false;
  }

  handleAddSchedule(schedule: Schedule): void {
    if (this.modalTitle === 'Edit Schedule' && schedule.id) {
      this.store.dispatch(ScheduleActions.updateSchedule({ schedule_id: schedule.id, updateSchedule: {...schedule}  }));
    } else {
      this.store.dispatch(ScheduleActions.createSchedule({ createSchedule: schedule }));
    }
    
    this.closeAddScheduleModal();
  }

  sortSchedules(column: string): void {
    this.sortColumn = column;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  
  }

  filterSchedules(search: string): void {
    this.searchTerm = search;

  }

  onItemsPerPageChange(items: number): void {
    this.itemsPerPage = items;
  }

  onSearch(event: Event): void {
    const search = (event.target as HTMLInputElement).value;
    this.filterSchedules(search);
  }

    handleActionClick(event: { action: string; row: Schedule }): void {
      const { action, row } = event;
    
      if (action === 'edit') {
        
        this.editSchedule(row);
      } else if (action === 'delete') {
        if (row.id !== undefined ) {
          // ✅ Store ID and Patient ID before showing modal
          this.selectSelectedScheduleById = row.id;
          this.isAddScheduleModalVisible = true; // ✅ Show modal
        } else {
          console.error('Cannot delete dental history: ID or patient ID is undefined');
        }
      }
    }

    editSchedule(schedule: Schedule): void {
      this.modalTitle = 'Edit Schedule';
      this.isAddScheduleModalVisible = true;
    
      if (schedule.id !== undefined) {
        this.store.dispatch(ScheduleActions.loadScheduleById({ schedule_id: schedule.id }));
    
        // ✅ Ensure the modal opens with prefilled data
        this.scheduleById$ = this.store.pipe(
          select(selectSelectedSchedule),
          map(selected => selected ?? ({} as Schedule))
        );
      } else {
        console.error('Cannot edit schedule: ID is undefined');
      }
    }

    deleteSchedule(schedule: Schedule): void {
        this.store.dispatch(ScheduleActions.deleteSchedule({ id: schedule.id }));
    }
}
