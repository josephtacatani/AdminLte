import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalHistoryData } from 'src/app/interfaces/patients.interface';
import { Router } from '@angular/router';
import { TableWithEditDeleteComponent } from 'src/app/my-components/tables/table-with-edit-delete/table-with-edit-delete.component';
import { AddEditMedicalHistoryComponent } from 'src/app/my-components/modals/add-edit-medical-history/add-edit-medical-history.component';

@Component({
  selector: 'app-patient-medicalhistory-table',
  standalone: true,
  imports: [CommonModule, TableWithEditDeleteComponent, AddEditMedicalHistoryComponent],
  templateUrl: './patient-medicalhistory-table.component.html',
  styleUrls: ['./patient-medicalhistory-table.component.scss']
})
export class PatientMedicalhistoryTableComponent {
  sortColumn: string = 'date'; // Default sort column
    sortDirection: string = 'asc'; // Default sort direction
    selectedMedicalHistory: MedicalHistoryData | null = null;
  
    medicalHistoryData: MedicalHistoryData[] = [
      { id: 1, allergies: 'Peanuts', illnesses: 'Asthma', action: 'View' },
      { id: 2, allergies: 'Penicillin', illnesses: 'Diabetes', action: 'View' }
    ];
  
    filteredmedicalHistoryData: MedicalHistoryData[] = [...this.medicalHistoryData];
  
    columns = [
      { key: 'allergies', label: 'Allergies', sortable: true },
      { key: 'illnesses', label: 'Illnesses', sortable: true },
      { key: 'action', label: 'Action', sortable: false }
    ];
  
    itemsPerPage = 10;
    searchTerm = '';
    currentPage = 1;
  
    isAddMedicalHistoryModalVisible: boolean = false;
    modalTitle: string = 'Add Medical History';
  
    constructor(private router: Router) {}
  
    ngOnInit(): void {
      this.sortmedicalHistoryData(this.sortColumn);
    }
  
    filtermedicalHistoryData(search: string): void {
      this.searchTerm = search.trim(); // Trim unnecessary spaces
  
      if (this.searchTerm === '') {
        // Reset to full list if the search box is cleared
        this.filteredmedicalHistoryData = [...this.medicalHistoryData];
      } else {
        // Filter dynamically based on search term
        this.filteredmedicalHistoryData = this.medicalHistoryData.filter((medical) =>
          Object.values(medical)
            .join(' ')
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
        );
      }
    }
  
    sortmedicalHistoryData(column: string): void {
      this.sortColumn = column;
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  
      this.filteredmedicalHistoryData.sort((a, b) => {
        const valA = (a as any)[column]?.toString().toLowerCase() || ''; // Access dynamically
        const valB = (b as any)[column]?.toString().toLowerCase() || '';
  
        return this.sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }
  
    openAddMedicalHistoryModal(): void {
      this.modalTitle = 'Add Medical History';
      this.isAddMedicalHistoryModalVisible = true;
    }
  
    closeAddMedicalHistoryModal(): void {
      this.isAddMedicalHistoryModalVisible = false;
    }
  
    handleDentalHistorySubmit(medicalHistory: MedicalHistoryData): void {
      if (medicalHistory.id) {
        // Edit existing data
        const index = this.medicalHistoryData.findIndex(item => item.id === medicalHistory.id);
        if (index !== -1) {
          this.medicalHistoryData[index] = { ...medicalHistory }; // Update the data
        }
      } else {
        // Add new data
        medicalHistory.id = Date.now(); // Generate unique ID for the new entry
        this.medicalHistoryData.push(medicalHistory);
      }
      this.filtermedicalHistoryData(this.searchTerm); // Refresh the table data
      this.closeAddMedicalHistoryModal(); // Close the modal
    }
  
    handleActionClick(event: { action: string; row: MedicalHistoryData }): void {
      if (event.action === 'edit') {
        this.editMedicalHistory(event.row);
      } else if (event.action === 'delete') {
        this.deleteMedicalHistory(event.row);
      }
    }
    
    editMedicalHistory(medicalHistory: MedicalHistoryData): void {
      this.modalTitle = 'Edit Medical History';
      this.selectedMedicalHistory = { ...medicalHistory }; // Pass the selected row
      this.isAddMedicalHistoryModalVisible = true; // Show the modal
    }
  
    deleteMedicalHistory(medicalHistory: MedicalHistoryData): void {
      this.medicalHistoryData = this.medicalHistoryData.filter(item => item.id !== medicalHistory.id);
      this.filtermedicalHistoryData(this.searchTerm); // Refresh the filtered data
    }
}
