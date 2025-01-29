import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-with-edit-delete',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, FormsModule],
  templateUrl: './table-with-edit-delete.component.html',
  styleUrls: ['./table-with-edit-delete.component.scss']
})
export class TableWithEditDeleteComponent {
    @Input() title: string = 'Table';
    @Input() data: any[] = []; // Table data
    @Input() columns: { key: string; label: string; sortable?: boolean }[] = []; // Column definitions
    @Input() itemsPerPage: number = 10;
    @Input() pageSizeOptions: number[] = [5, 10, 15, 20];
    @Input() sortColumn: string = '';
    @Input() sortDirection: string = 'asc';
    @Input() currentPage: number = 1;
    @Input() searchTerm: string = '';
    @Input() showAddButton: boolean = false;
    @Input() addButtonText: string = 'Add Item';
    @Input() actions: { label: string; icon?: string; callback: string }[] = [];
  
    @Output() sort = new EventEmitter<string>();
    @Output() search = new EventEmitter<string>();
    @Output() add = new EventEmitter<void>();
    @Output() updatePageSize = new EventEmitter<number>();
    @Output() currentPageChange = new EventEmitter<number>();
    @Output() itemsPerPageChange = new EventEmitter<number>();
    @Output() searchTermChange = new EventEmitter<string>();
    @Output() actionClick = new EventEmitter<{ action: string; row: any }>();
  
    
    ngOnChanges(): void {
      this.itemsPerPageChange.emit(this.itemsPerPage);
      this.searchTermChange.emit(this.searchTerm);
    }
}
