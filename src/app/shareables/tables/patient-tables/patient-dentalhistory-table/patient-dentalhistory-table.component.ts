import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DentalHistoryData } from 'src/app/interfaces/patients.interface';
import { TableWithEditDeleteComponent } from 'src/app/my-components/tables/table-with-edit-delete/table-with-edit-delete.component';
import { AddEditDentalHistoryComponent } from 'src/app/my-components/modals/add-edit-dental-history/add-edit-dental-history.component';
import { DentalHistoryService } from 'src/app/services/patients/patient-dental-history-service';

@Component({
  selector: 'app-patient-dentalhistory-table',
  standalone: true,
  imports: [CommonModule, TableWithEditDeleteComponent, AddEditDentalHistoryComponent],
  templateUrl: './patient-dentalhistory-table.component.html',
  styleUrls: ['./patient-dentalhistory-table.component.scss'],
})
export class PatientDentalhistoryTableComponent implements OnInit {
  pagetitle = 'Patient Dental History';
  dentalHistoryData: DentalHistoryData[] = [];
  filteredDentalHistoryData: DentalHistoryData[] = [];
  selectedDentalHistory: DentalHistoryData | null = null;
  errorMessage: string = '';
  isLoading: boolean = false;

  columns = [
    { key: 'previousDentist', label: 'Previous Dentist', sortable: true },
    { key: 'lastDentalVisit', label: 'Last Dental Visit', sortable: true },
    { key: 'action', label: 'Action', sortable: false },
  ];

  sortColumn: string = 'lastDentalVisit';
  sortDirection: string = 'asc';
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;
  isAddEditModalVisible: boolean = false;
  modalTitle: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dentalHistoryService: DentalHistoryService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const patientId = Number(params.get('patientId'));
      console.log('Retrieved patientId from route:', patientId);

      if (patientId) {
        this.loadDentalHistory(patientId);
      } else {
        this.errorMessage = 'Invalid patient ID.';
        console.error(this.errorMessage);
      }
    });
  }

  // Fetch dental history data for a specific patient
  loadDentalHistory(patientId: number): void {
    this.isLoading = true;

    this.dentalHistoryService.getDentalHistoryByPatientId(patientId).subscribe({
      next: (data: DentalHistoryData[]) => {
        if (data.length > 0) {
          this.dentalHistoryData = data;
          this.filteredDentalHistoryData = [...data];
          console.log('Dental history for patient:', data);
        } else {
          this.errorMessage = `No dental history found for patient ID ${patientId}.`;
          console.warn(this.errorMessage);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load dental history.';
        console.error(this.errorMessage, err);
        this.isLoading = false;
      },
    });
  }

  // Open modal for adding or editing dental history
  openAddEditModal(dentalHistory?: DentalHistoryData): void {
    if (dentalHistory) {
      this.modalTitle = 'Edit Dental History';
      this.selectedDentalHistory = { ...dentalHistory };
    } else {
      this.modalTitle = 'Add Dental History';
      this.selectedDentalHistory = null;
    }
    this.isAddEditModalVisible = true;
  }

  closeAddDentalHistoryModal(): void {
    this.isAddEditModalVisible = false;
  }
  

  // Handle submission of dental history (add or edit)
  handleDentalHistorySubmit(dentalHistory: DentalHistoryData): void {
    if (dentalHistory.id) {
      // Update existing record
      this.dentalHistoryService.updateDentalHistory(dentalHistory.id, dentalHistory).subscribe({
        next: () => {
          const index = this.dentalHistoryData.findIndex((item) => item.id === dentalHistory.id);
          if (index !== -1) {
            this.dentalHistoryData[index] = { ...dentalHistory };
          }
          this.filteredDentalHistoryData = [...this.dentalHistoryData];
          this.isAddEditModalVisible = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to update dental history.';
          console.error(this.errorMessage, err);
        },
      });
    } else {
      // Add new record
      this.dentalHistoryService.addDentalHistory(dentalHistory).subscribe({
        next: (newData) => {
          this.dentalHistoryData.push(newData);
          this.filteredDentalHistoryData = [...this.dentalHistoryData];
          this.isAddEditModalVisible = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to add dental history.';
          console.error(this.errorMessage, err);
        },
      });
    }
  }

  // Delete a dental history record
  deleteDentalHistory(dentalHistory: DentalHistoryData): void {
    this.dentalHistoryService.deleteDentalHistory(dentalHistory.id).subscribe({
      next: () => {
        this.dentalHistoryData = this.dentalHistoryData.filter((item) => item.id !== dentalHistory.id);
        this.filteredDentalHistoryData = [...this.dentalHistoryData];
        console.log(`Deleted dental history with ID ${dentalHistory.id}`);
      },
      error: (err) => {
        this.errorMessage = 'Failed to delete dental history.';
        console.error(this.errorMessage, err);
      },
    });
  }

  // Filter dental history data
  filterDentalHistoryData(search: string): void {
    this.searchTerm = search.trim();
    this.filteredDentalHistoryData = this.searchTerm
      ? this.dentalHistoryData.filter((dentalHistory) =>
          Object.values(dentalHistory)
            .join(' ')
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
        )
      : [...this.dentalHistoryData];
  }

  // Sort dental history data
  sortDentalHistoryData(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredDentalHistoryData.sort((a, b) => {
      const valA = (a as any)[column]?.toString().toLowerCase() || '';
      const valB = (b as any)[column]?.toString().toLowerCase() || '';

      return this.sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }
  handleActionClick(event: { action: string; row: DentalHistoryData }): void {
    const { action, row } = event;
  
    if (action === 'edit') {
      this.openAddEditModal(row); // Pass the row to open modal for editing
    } else if (action === 'delete') {
      this.deleteDentalHistory(row); // Pass the row to delete the record
    }
  }
  
  
}


