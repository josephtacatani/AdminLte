import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-edit-delete-table',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './edit_delete_table.component.html',
  styleUrls: ['./edit_delete_table.component.scss']
})
export class EditDeleteTableComponent {
  @Input() title: string = 'Table';
  @Input() data: any[] = []; // Accepts schedules, appointments, or any table data
  @Input() columns: { key: string; label: string; sortable?: boolean }[] = []; // Dynamic columns
  @Input() itemsPerPage: number = 10;
  @Input() currentPage: number = 1;
  @Input() searchTerm: string = '';

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() sort = new EventEmitter<string>();
  @Output() searchTermChange = new EventEmitter<string>();
  @Output() currentPageChange = new EventEmitter<number>();

  handleEdit(item: any) {
    this.edit.emit(item);
  }

  handleDelete(item: any) {
    this.delete.emit(item);
  }
}