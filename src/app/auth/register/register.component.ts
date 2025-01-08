import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  ngOnInit(): void {
    $('#reservationdate').datetimepicker({
      format: 'L',
      defaultDate: new Date() // Set default date to today
    });

    $('.select2').select2({
      placeholder: 'Select a Sex',
      allowClear: true
    });
  }

  checkPasswordStrength(): void {
    const password = (document.getElementById('password') as HTMLInputElement).value;
    let strength = 0;

    // Criteria
    const criteria = [
      { regex: /[a-z]/, elementId: 'lowercase' },
      { regex: /[A-Z]/, elementId: 'lowercase' },
      { regex: /[0-9]/, elementId: 'number' },
      { regex: /[!@#$%^&*]/, elementId: 'special' },
      { regex: /.{8,}/, elementId: 'length' }
    ];

    criteria.forEach(criterion => {
      const element = document.getElementById(criterion.elementId);
      if (element) {
        const icon = element.querySelector('i');
        if (icon && criterion.regex.test(password)) {
          icon.classList.add('fa-check', 'text-success');
          icon.classList.remove('fa-times', 'text-danger');
          strength += 20;
        } else if (icon) {
          icon.classList.add('fa-times', 'text-danger');
          icon.classList.remove('fa-check', 'text-success');
        }
      }
    });

    // Update progress bar
    const progressBar = document.getElementById('password-strength-bar');
    if (progressBar) {
      progressBar.style.width = `${strength}%`;
      progressBar.setAttribute('aria-valuenow', strength.toString());

      // Update progress bar color
      progressBar.classList.remove('bg-danger', 'bg-warning', 'bg-success', 'bg-primary');
      if (strength < 40) {
        progressBar.classList.add('bg-danger');
      } else if (strength < 60) {
        progressBar.classList.add('bg-warning');
      } else if (strength < 80) {
        progressBar.classList.add('bg-primary');
      } else {
        progressBar.classList.add('bg-success');
      }
    }

    // Update strength text
    const strengthText = document.getElementById('password-strength-text');
    if (strengthText) {
      if (strength < 40) {
        strengthText.textContent = 'Weak';
      } else if (strength < 60) {
        strengthText.textContent = 'Moderate';
      } else if (strength < 80) {
        strengthText.textContent = 'Good';
      } else {
        strengthText.textContent = 'Strong';
      }
    }
  }
}
