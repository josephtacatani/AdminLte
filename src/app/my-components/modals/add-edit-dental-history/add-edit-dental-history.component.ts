import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DentalHistory } from 'src/app/interfaces/dental_history.interface';

@Component({
  selector: 'app-add-edit-dental-history',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-edit-dental-history.component.html',
  styleUrls: ['./add-edit-dental-history.component.scss']
})
export class AddEditDentalHistoryComponent implements OnChanges {
  @Input() isVisible: boolean = false;
  @Input() title: string = 'Add Dental History';
  @Input() dentalHistory: DentalHistory | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() submitModal = new EventEmitter<DentalHistory>();

  dentalHistoryForm!: FormGroup;

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Initialize form with necessary fields
    this.dentalHistoryForm = this.fb.group({
      id: [null], // Preserve for updates, otherwise null
      patient_id: [null, Validators.required], // Required patient_id
      previous_dentist: ['', Validators.required],
      last_dentist_visit: ['', Validators.required],
    });

    // Fetch patient_id from route parameters
    this.route.paramMap.subscribe(params => {
      const patientId = Number(params.get('patientId'));
      if (!isNaN(patientId) && patientId > 0) {
        this.dentalHistoryForm.patchValue({ patient_id: patientId });
      } else {
        console.error('Invalid patient ID');
      }
    });

    // Populate form if editing existing history
    if (this.dentalHistory) {
      this.dentalHistoryForm.patchValue(this.dentalHistory);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dentalHistory'] && this.dentalHistory) {
      this.dentalHistoryForm.patchValue(this.dentalHistory);
    }
  }

  close(): void {
    this.closeModal.emit();
  }


  submitDentalHistory(): void {
    if (this.dentalHistoryForm.valid) {
      const dentalHistory: DentalHistory = {
        id: this.dentalHistory?.id !== null ? this.dentalHistory?.id : undefined,  // Ensure id is number or undefined
        patient_id: this.dentalHistoryForm.get('patient_id')?.value,
        previous_dentist: this.dentalHistoryForm.get('previous_dentist')?.value.trim(),
        last_dentist_visit: this.dentalHistoryForm.get('last_dentist_visit')?.value,
      };

      console.log("Submitting Dental History:", dentalHistory);

      // Emit the updated form data
      this.submitModal.emit(dentalHistory);

      // Close modal
      this.close();
    } else {
      alert('Please fill out all required fields.');
    }
  }
}
