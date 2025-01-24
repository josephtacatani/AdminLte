import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DentalHistoryData } from 'src/app/interfaces/patients.interface';


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
  @Input() dentalHistoryData: DentalHistoryData | null = null; // Input for selected data
  @Output() closeModal = new EventEmitter<void>();
  @Output() submitModal = new EventEmitter<DentalHistoryData>();

  dentalHistoryForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.dentalHistoryForm = this.fb.group({
      id: [null], // Retain the ID field for editing
      previousDentist: ['', Validators.required],
      lastDentalVisit: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dentalHistoryData'] && this.dentalHistoryData) {
      // Populate form with selected row data
      this.dentalHistoryForm.patchValue(this.dentalHistoryData);
    }
  }

  close(): void {
    this.closeModal.emit();
  }

  submitDentalHistory(): void {
    if (this.dentalHistoryForm.valid) {
      const dentalHistory: DentalHistoryData = this.dentalHistoryForm.value;
      this.submitModal.emit(dentalHistory); // Emit data to parent
      this.close();
    } else {
      alert('Please fill out all required fields.');
    }
  }
}