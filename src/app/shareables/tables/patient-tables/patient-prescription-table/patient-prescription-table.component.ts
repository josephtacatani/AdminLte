import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DisplayTableComponent } from 'src/app/my-components/tables/display-table/display-table.component';
import { PrescriptionData } from 'src/app/interfaces/patients.interface';
import { PrescriptionService } from 'src/app/services/patients/patient-prescription-service';


@Component({
  selector: 'app-patient-prescription-table',
  standalone: true,
  imports: [CommonModule, DisplayTableComponent],
  templateUrl: './patient-prescription-table.component.html',
  styleUrls: ['./patient-prescription-table.component.scss']
})
export class PatientPrescriptionTableComponent implements OnInit {
  sortColumn: string = 'date'; // Default sort column
  sortDirection: string = 'asc'; // Default sort direction
  prescriptionData: PrescriptionData[] = [];
  filteredPrescriptionData: PrescriptionData[] = [];
  errorMessage: string = ''; // Declare error message variable

  columns = [
    { key: 'date', label: 'Date', sortable: true },
    { key: 'medicine', label: 'Medicine', sortable: true },
    { key: 'notes', label: 'Notes', sortable: true },
  ];

  itemsPerPage = 10;
  searchTerm = '';
  currentPage = 1;

  constructor(
    private router: Router,
    private prescriptionService: PrescriptionService
  ) {}

  ngOnInit(): void {
    this.loadPrescriptions();
  }

  // Load all prescriptions
  loadPrescriptions(): void {
    this.prescriptionService.getPrescriptions().subscribe({
      next: (data) => {
        this.prescriptionData = data;
        this.filteredPrescriptionData = [...this.prescriptionData]; // Initialize filtered data
        this.sortprescriptionData(this.sortColumn); // Apply initial sorting
      },
      error: (err) => {
        this.errorMessage = 'Failed to load prescriptions';
        console.error(err);
      }
    });
  }

  // Add a new prescription
  addPrescription(newPrescription: PrescriptionData): void {
    this.prescriptionService.addPrescription(newPrescription).subscribe({
      next: (prescription) => {
        this.prescriptionData.push(prescription);
        this.filterprescriptionData(this.searchTerm); // Update filtered list
      },
      error: (err) => {
        this.errorMessage = 'Failed to add prescription';
        console.error(err);
      }
    });
  }

  // Update a prescription
  updatePrescription(updatedPrescription: PrescriptionData): void {
    this.prescriptionService.updatePrescription(updatedPrescription.id, updatedPrescription).subscribe({
      next: () => {
        const index = this.prescriptionData.findIndex((p) => p.id === updatedPrescription.id);
        if (index > -1) {
          this.prescriptionData[index] = updatedPrescription;
          this.filterprescriptionData(this.searchTerm); // Update filtered list
        }
      },
      error: (err) => {
        this.errorMessage = 'Failed to update prescription';
        console.error(err);
      }
    });
  }

  // Delete a prescription
  deletePrescription(id: number): void {
    this.prescriptionService.deletePrescription(id).subscribe({
      next: () => {
        this.prescriptionData = this.prescriptionData.filter((p) => p.id !== id);
        this.filterprescriptionData(this.searchTerm); // Update filtered list
      },
      error: (err) => {
        this.errorMessage = 'Failed to delete prescription';
        console.error(err);
      }
    });
  }

  // Filter prescription data
  filterprescriptionData(search: string): void {
    this.searchTerm = search.trim();
    if (this.searchTerm === '') {
      this.filteredPrescriptionData = [...this.prescriptionData];
    } else {
      this.filteredPrescriptionData = this.prescriptionData.filter((prescription) =>
        Object.values(prescription)
          .join(' ')
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase())
      );
    }
  }

  // Sort prescription data
  sortprescriptionData(column: string): void {
    this.sortColumn = column;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

    this.filteredPrescriptionData.sort((a, b) => {
      const valA = (a as any)[column]?.toString().toLowerCase() || '';
      const valB = (b as any)[column]?.toString().toLowerCase() || '';
      return this.sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }
}
