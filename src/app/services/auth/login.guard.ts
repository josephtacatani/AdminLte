import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const accessToken = sessionStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userRole = sessionStorage.getItem('userRole'); // ✅ Check user role

    // ✅ If user is already logged in, prevent access to login page
    if (accessToken && refreshToken && userRole) {
      this.router.navigate(userRole === 'patient' ? ['/patientdashboard'] : ['/dentistdashboard']);
      return false;
    }

    return true; // ✅ Allow access to login if no tokens/role
  }
}
