import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DentalHistoryData } from 'src/app/interfaces/patients.interface';
import { TableWithEditDeleteComponent } from 'src/app/my-components/tables/table-with-edit-delete/table-with-edit-delete.component';
import { AddEditDentalHistoryComponent } from 'src/app/my-components/modals/add-edit-dental-history/add-edit-dental-history.component';

@Component({
  selector: 'app-patient-dentalhistory-table',
  standalone: true,
  imports: [CommonModule, TableWithEditDeleteComponent, AddEditDentalHistoryComponent],
  templateUrl: './patient-dentalhistory-table.component.html',
  styleUrls: ['./patient-dentalhistory-table.component.scss']
})
export class PatientDentalhistoryTableComponent {
  sortColumn: string = 'date'; // Default sort column
  sortDirection: string = 'asc'; // Default sort direction
  selectedDentalHistory: DentalHistoryData | null = null;

  dentalHistoryData: DentalHistoryData[] = [
    { id: 1, previousDentist: 'Dr. John Smith', lastDentalVisit: '2022-12-01', action: 'View' },
    { id: 2, previousDentist: 'Dr. Jane Doe', lastDentalVisit: '2022-11-15', action: 'View' }
  ];

  filtereddentalHistoryData: DentalHistoryData[] = [...this.dentalHistoryData];

  columns = [
    { key: 'previousDentist', label: 'Previous Dentist', sortable: true },
    { key: 'lastDentalVisit', label: 'Last Dental Visit', sortable: true },
    { key: 'action', label: 'Action', sortable: false }
  ];

  itemsPerPage = 10;
  searchTerm = '';
  currentPage = 1;

  isAddDentalHistoryModalVisible: boolean = false;
  modalTitle: string = 'Add Dental History';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.sortdentalHistoryData(this.sortColumn);
  }

  filterdentalHistoryData(search: string): void {
    this.searchTerm = search.trim(); // Trim unnecessary spaces

    if (this.searchTerm === '') {
      // Reset to full list if the search box is cleared
      this.filtereddentalHistoryData = [...this.dentalHistoryData];
    } else {
      // Filter dynamically based on search term
      this.filtereddentalHistoryData = this.dentalHistoryData.filter((treatment) =>
        Object.values(treatment)
          .join(' ')
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase())
      );
    }
  }

  sortdentalHistoryData(column: string): void {
    this.sortColumn = column;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

    this.filtereddentalHistoryData.sort((a, b) => {
      const valA = (a as any)[column]?.toString().toLowerCase() || ''; // Access dynamically
      const valB = (b as any)[column]?.toString().toLowerCase() || '';

      return this.sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }

  openAddDentalHistoryModal(): void {
    this.modalTitle = 'Add Dental History';
    this.isAddDentalHistoryModalVisible = true;
  }

  closeAddDentalHistoryModal(): void {
    this.isAddDentalHistoryModalVisible = false;
  }

  handleDentalHistorySubmit(dentalHistory: DentalHistoryData): void {
    if (dentalHistory.id) {
      // Edit existing data
      const index = this.dentalHistoryData.findIndex(item => item.id === dentalHistory.id);
      if (index !== -1) {
        this.dentalHistoryData[index] = { ...dentalHistory }; // Update the data
      }
    } else {
      // Add new data
      dentalHistory.id = Date.now(); // Generate unique ID for the new entry
      this.dentalHistoryData.push(dentalHistory);
    }
    this.filterdentalHistoryData(this.searchTerm); // Refresh the table data
    this.closeAddDentalHistoryModal(); // Close the modal
  }

  handleActionClick(event: { action: string; row: DentalHistoryData }): void {
    if (event.action === 'edit') {
      this.editDentalHistory(event.row);
    } else if (event.action === 'delete') {
      this.deleteDentalHistory(event.row);
    }
  }
  
  editDentalHistory(dentalHistory: DentalHistoryData): void {
    this.modalTitle = 'Edit Dental History';
    this.selectedDentalHistory = { ...dentalHistory }; // Pass the selected row
    this.isAddDentalHistoryModalVisible = true; // Show the modal
  }

  deleteDentalHistory(dentalHistory: DentalHistoryData): void {
    this.dentalHistoryData = this.dentalHistoryData.filter(item => item.id !== dentalHistory.id);
    this.filterdentalHistoryData(this.searchTerm); // Refresh the filtered data
  }
}
