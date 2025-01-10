import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { PatientDataService } from 'src/app/services/patients/patient-data-service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  passwordStrength: string = 'Weak';
  progressBarWidth: number = 0;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private patientDataService: PatientDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      email: ['', [Validators.required, Validators.email]],
      profilePicture: [null, Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    });
  }

  handleFileInput(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.registerForm.patchValue({ profilePicture: base64String });
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };
      reader.readAsDataURL(file);
    }
  }

  checkPasswordStrength(): void {
    const password = this.registerForm.get('password')?.value || '';
    let strength = 0;

    const criteria = [
      { regex: /[a-z]/, description: 'lowercase' },
      { regex: /[A-Z]/, description: 'uppercase' },
      { regex: /[0-9]/, description: 'number' },
      { regex: /[!@#$%^&*]/, description: 'special character' },
      { regex: /.{8,}/, description: 'minimum 8 characters' }
    ];

    criteria.forEach((criterion) => {
      if (criterion.regex.test(password)) {
        strength += 20;
      }
    });

    this.progressBarWidth = strength;
    if (strength < 40) {
      this.passwordStrength = 'Weak';
    } else if (strength < 60) {
      this.passwordStrength = 'Moderate';
    } else if (strength < 80) {
      this.passwordStrength = 'Good';
    } else {
      this.passwordStrength = 'Strong';
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isSubmitting = true;
      const patientData = this.registerForm.value;

      this.patientDataService.addPatient(patientData).subscribe({
        next: (response) => {
          console.log('Patient added successfully:', response);
          this.isSubmitting = false;
          this.router.navigate(['/patients']); // Redirect to patients list or another page
        },
        error: (err) => {
          console.error('Failed to add patient:', err);
          this.isSubmitting = false;
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
