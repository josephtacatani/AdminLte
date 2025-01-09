import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientData } from 'src/app/interfaces/patients.interface';
import { PatientDataService } from 'src/app/services/patients/patient-data-service';
import { InfoCardComponent } from 'src/app/my-components/cards/info-card/info-card.component';
import { PatientAppointmentTableComponent } from 'src/app/shareables/tables/patient-tables/patient-appointment-table/patient-appointment-table.component';
import { PatientPrescriptionTableComponent } from 'src/app/shareables/tables/patient-tables/patient-prescription-table/patient-prescription-table.component';
import { AddEditDentalHistoryComponent } from 'src/app/my-components/modals/add-edit-dental-history/add-edit-dental-history.component';
import { PatientDentalhistoryTableComponent } from 'src/app/shareables/tables/patient-tables/patient-dentalhistory-table/patient-dentalhistory-table.component';
import { AddEditMedicalHistoryComponent } from 'src/app/my-components/modals/add-edit-medical-history/add-edit-medical-history.component';
import { PatientMedicalhistoryTableComponent } from 'src/app/shareables/tables/patient-tables/patient-medicalhistory-table/patient-medicalhistory-table.component';
import { PatientTreatmentTableComponent } from 'src/app/shareables/tables/patient-tables/patient-treatment-table/patient-treatment-table.component';

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [
    CommonModule,
    InfoCardComponent,
    PatientAppointmentTableComponent,
    PatientPrescriptionTableComponent,
    AddEditDentalHistoryComponent,
    PatientDentalhistoryTableComponent,
    AddEditMedicalHistoryComponent,
    PatientMedicalhistoryTableComponent,
    PatientTreatmentTableComponent,
  ],
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss'],
})
export class PatientDetailsComponent implements OnInit {
  isAddDentalHistoryModalVisible = false;
  isAddMedicalHistoryModalVisible = false;

  errorMessage = '';
  isLoading = false;
  patientData: PatientData | null = null; // Change to a single patient object

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientDataService: PatientDataService
  ) {}

  ngOnInit(): void {
    // Ensure you're retrieving `patientId` correctly from the route
    this.route.paramMap.subscribe((params) => {
      const patientId = Number(params.get('patientId')); // Use the correct parameter name
      console.log('Retrieved patientId from route:', patientId); // Log the retrieved ID
  
      if (patientId) {
        this.loadPatientDetails(patientId);
      } else {
        this.errorMessage = 'Invalid patient ID.';
        console.error(this.errorMessage); // Log the error message
      }
    });
  }
  
  loadPatientDetails(patientId: number): void {
    this.isLoading = true;
    console.log('Loading details for patient with patientId:', patientId); // Log the ID being loaded
  
    this.patientDataService.getPatients().subscribe({
      next: (patients: PatientData[]) => {
        console.log('Fetched patients from service:', patients); // Log all fetched patients
  
        // Find patient based on `patientId`
        const patient = patients.find((p) => p.patientId === patientId);
        if (patient) {
          this.patientData = patient;
          console.log('Found patient:', this.patientData); // Log the found patient
        } else {
          this.errorMessage = `No patient found with patientId ${patientId}.`;
          console.warn(this.errorMessage); // Log a warning if no patient is found
        }
  
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load patient details.';
        console.error(this.errorMessage, err); // Log the error message and error object
        this.isLoading = false;
      },
    });
  }
  

  // Methods for modals
  openAddDentalHistoryModal(): void {
    this.isAddDentalHistoryModalVisible = true;
  }

  openAddMedicalHistoryModal(): void {
    this.isAddMedicalHistoryModalVisible = true;
  }

  closeAddDentalHistoryModal(): void {
    this.isAddDentalHistoryModalVisible = false;
  }

  closeAddMedicalHistoryModal(): void {
    this.isAddMedicalHistoryModalVisible = false;
  }

  handleDentalHistorySubmit(dentalHistory: any): void {
    console.log('Dental History Submitted:', dentalHistory);
    this.closeAddDentalHistoryModal();
  }

  handleMedicalHistorySubmit(medicalHistory: any): void {
    console.log('Medical History Submitted:', medicalHistory);
    this.closeAddMedicalHistoryModal();
  }
}
