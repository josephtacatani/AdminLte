import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { GeneralModalComponent } from 'src/app/my-components/modals/general-modal/general-modal.component';
import { TableComponent } from 'src/app/my-components/tables/table/table.component';
import { Schedule } from 'src/app/interfaces/patients.interface';
import { ScheduleService } from 'src/app/services/dentist/schedules.service';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, GeneralModalComponent, NgxPaginationModule, TableComponent],
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

  originalSchedules: Schedule[] = [];
  filteredSchedules: Schedule[] = [];

  constructor(private scheduleService: ScheduleService) {}

  ngOnInit(): void {
    this.fetchSchedules();
  }

  fetchSchedules(): void {
    this.scheduleService.getSchedules().subscribe({
      next: (schedules) => {
        this.originalSchedules = schedules;
        this.filteredSchedules = [...schedules];
      },
      error: (err) => console.error('Failed to fetch schedules:', err),
    });
  }

  openAddScheduleModal(): void {
    this.isAddScheduleModalVisible = true;
  }

  closeAddScheduleModal(): void {
    this.isAddScheduleModalVisible = false;
  }

  handleAddSchedule(schedule: Schedule): void {
    console.log('handleAddSchedule called with:', schedule); // Debug log
    this.scheduleService.addSchedule(schedule).subscribe({
      next: (newSchedule) => {
        console.log('API response:', newSchedule);
        this.originalSchedules.push(newSchedule); // Add the returned schedule
        this.filteredSchedules = [...this.originalSchedules];
        this.isAddScheduleModalVisible = false; // Close modal
      },
      error: (err) => console.error('Failed to add schedule:', err),
    });
  }

  sortSchedules(column: string): void {
    this.sortColumn = column;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.filteredSchedules.sort((a: any, b: any) => {
      const valA = a[column].toLowerCase();
      const valB = b[column].toLowerCase();
      return this.sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }

  filterSchedules(search: string): void {
    this.filteredSchedules = this.originalSchedules.filter((schedule) =>
      Object.values(schedule)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }

  onItemsPerPageChange(items: number): void {
    this.itemsPerPage = items;
  }

  onSearch(event: Event): void {
    const input = (event.target as HTMLInputElement).value.trim().toLowerCase();
  
    if (input === '') {
      // Reset to original schedules if the input is empty
      this.filteredSchedules = [...this.originalSchedules];
    } else {
      // Filter schedules based on input
      this.filteredSchedules = this.originalSchedules.filter((schedule) =>
        Object.values(schedule)
          .join(' ')
          .toLowerCase()
          .includes(input)
      );
    }
  }
  
}
