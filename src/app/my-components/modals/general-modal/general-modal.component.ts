import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Schedule } from 'src/app/interfaces/schedule.interface';

@Component({
  selector: 'app-general-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './general-modal.component.html',
  styleUrls: ['./general-modal.component.scss']
})
export class GeneralModalComponent {
  @Input() isVisible: boolean = false;
  @Input() title: string = 'Add Schedule';
  @Input() scheduleData: Schedule | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() submitModal = new EventEmitter<Schedule>();

  scheduleForm!: FormGroup; // Reactive form group

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Initialize the form
    this.scheduleForm = this.fb.group({
      date: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
    });
  }

  // Close modal
  close(): void {
    this.closeModal.emit();
  }

  // Submit schedule
  submitSchedule(): void {
    if (this.scheduleForm.valid) {
      const schedule: Schedule = this.scheduleForm.value;
      this.submitModal.emit(schedule);
      this.close(); // Close modal after submission
    } else {
      alert('Please fill out all required fields.');
    }
  }
}
