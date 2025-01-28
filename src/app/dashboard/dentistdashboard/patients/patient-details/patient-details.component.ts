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
import { Patient } from 'src/app/interfaces/patient_details.interface';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectPatients, selectSelectedPatient } from 'src/app/ngrx/patients/patients.reducers';
import { PatientsActions } from 'src/app/ngrx/patients/patients.actions';
import { decodeAccessToken } from 'src/app/services/auth/auth.utils';
import { DentalHistoryActions } from 'src/app/ngrx/dental_history/dental_history.actions';
import { DentalHistory } from 'src/app/interfaces/dental_history.interface';

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
  patientData$: Observable<Patient | null> = this.store.select(selectSelectedPatient);

  constructor(
    private store: Store,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.store.dispatch(PatientsActions.loadPatients()); // Load the selected patient
   

    const patientId = Number(this.route.snapshot.paramMap.get('patientId')); // ✅ Get patientId from the URL

    if (patientId) {
      this.store.dispatch(PatientsActions.loadPatient({ id: patientId })); // ✅ Dispatch action to load the patient
    }
  
  
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

  handleDentalHistorySubmit(dentalHistory: DentalHistory): void {
    console.log('Dental History Submitted:', dentalHistory);
    this.store.dispatch(DentalHistoryActions.createDentalHistory({ dentalHistory }));
    this.closeAddDentalHistoryModal();
    this.route.paramMap.subscribe(params => {
      const patientId = Number(params.get('patientId'));
  
      if (!isNaN(patientId) && patientId > 0) {
        this.store.dispatch(DentalHistoryActions.loadDentalHistoriesByPatientId( {patientId: patientId} ));
      } else {
        console.error('Cannot delete dental history: Patient ID is missing in URL');
      }
    });
  }

  handleMedicalHistorySubmit(medicalHistory: any): void {
    console.log('Medical History Submitted:', medicalHistory);
    this.closeAddMedicalHistoryModal();
  }
}
