import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { GeneralModalComponent } from 'src/app/modals/general-modal/general-modal.component';
import { TableComponent } from 'src/app/ashared/table/table.component';

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

  originalSchedules = [
    { date: '2025-01-12', startTime: '09:00 AM', endTime: '05:00 PM', duration: '8 hours' },
    { date: '2025-01-13', startTime: '10:00 AM', endTime: '06:00 PM', duration: '8 hours' },
    { date: '2025-01-14', startTime: '09:30 AM', endTime: '05:30 PM', duration: '8 hours' },
  ];
  filteredSchedules = [...this.originalSchedules];

  ngOnInit(): void {}

  openAddScheduleModal(): void {
    this.isAddScheduleModalVisible = true;
  }

  closeAddScheduleModal(): void {
    this.isAddScheduleModalVisible = false;
  }

  handleAddSchedule(schedule: any): void {
    console.log('Schedule added:', schedule);
    this.originalSchedules.push(schedule);
    this.filteredSchedules = [...this.originalSchedules];
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
