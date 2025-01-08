import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalHistoryData } from 'src/app/interfaces/patients.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-edit-medical-history',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-edit-medical-history.component.html',
  styleUrls: ['./add-edit-medical-history.component.scss']
})
export class AddEditMedicalHistoryComponent {
  @Input() isVisible: boolean = false;
  @Input() title: string = 'Add Medical History';
  @Input() medicalHistoryData: MedicalHistoryData | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() submitModal = new EventEmitter<MedicalHistoryData>();

  medicalHistoryForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.medicalHistoryForm = this.fb.group({
      id: [null],
      condition: [''],
      symptoms: [''],
      lastVisitDate: [''],
      ongoingTreatment: [null],
      medicationDetails: [''],
      allergies: ['', Validators.required],
      illnesses: [''],
      action: ['View'],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['medicalHistoryData'] && this.medicalHistoryData) {
      this.medicalHistoryForm.patchValue(this.medicalHistoryData);
    }
  }

  close(): void {
    this.closeModal.emit();
  }

  submitMedicalHistory(): void {
    if (this.medicalHistoryForm.valid) {
      const medicalHistory: MedicalHistoryData = this.medicalHistoryForm.value;
      this.submitModal.emit(medicalHistory);
      this.close();
    } else {
      alert('Please fill out all required fields.');
    }
  }
}
