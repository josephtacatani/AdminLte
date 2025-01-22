import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, NgSelectModule, ReactiveFormsModule, FormsModule], // ✅ Added FormsModule
  templateUrl: './health_declaration.component.html',
  styleUrls: ['./health_declaration.component.scss'],
})
export class HealthDeclarationComponent implements OnInit {
  healthDeclarationForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.healthDeclarationForm = this.fb.group({
      fever: ['', Validators.required],
      breathing: ['', Validators.required],
      cough: ['', Validators.required],
      nose: ['', Validators.required],
      smell: ['', Validators.required],
      throat: ['', Validators.required],
      diarrhea: ['', Validators.required],
      influenza: ['', Validators.required],
      historyCovid: ['', Validators.required],
      familyPositive: ['', Validators.required],
      contactPositive: ['', Validators.required],
      localTransmission: ['', Validators.required],
      travelPh: ['', Validators.required],
      travelOutsidePh: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.healthDeclarationForm.valid) {
      console.log('Health Declaration Submitted:', this.healthDeclarationForm.value);
    } else {
      console.log('Form is invalid. Please complete all required fields.');
    }
  }
}
