import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
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
export class GeneralModalComponent implements OnInit, OnChanges {
  @Input() isVisible: boolean = false;
  @Input() title: string = 'Add Schedule';
  @Input() scheduleData: Schedule | null = null; // Data to populate the form
  @Output() closeModal = new EventEmitter<void>();
  @Output() submitModal = new EventEmitter<Schedule>();

  scheduleForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.scheduleForm = this.fb.group({
      date: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
    });
  }

  // Detect changes to @Input() properties
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['scheduleData']) {
      if (this.scheduleData) {
        // ✅ If editing, patch the form with data
        this.scheduleForm.patchValue({
          date: this.formatDateForInput(this.scheduleData.date),
          start_time: this.scheduleData.start_time,
          end_time: this.scheduleData.end_time,
        });
      } else {
        // ✅ If adding, reset the form
        this.scheduleForm.reset();
      }
    }
  }

  // Format date to 'yyyy-MM-dd' for input[type="date"]
  private formatDateForInput(date: string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  close(): void {
    this.closeModal.emit();
  }

  submitSchedule(): void {
    if (this.scheduleForm.valid) {
      const schedule: Schedule = {
        ...this.scheduleData,  // ✅ Keep the original ID and other properties
        ...this.scheduleForm.value // ✅ Overwrite with new form data
      };
      console.log('Submitting Schedule from Modal:', schedule); // Debug Modal Data
      this.submitModal.emit(schedule);
      this.close();
    } else {
      alert('Please fill out all required fields.');
    }
  }
  
}