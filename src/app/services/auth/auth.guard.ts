import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { decodeAccessToken } from './auth.utils';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const accessToken = sessionStorage.getItem('accessToken');
    
    if (!accessToken) {
      this.router.navigate(['/login']);
      return false;
    }

    const userRole = decodeAccessToken()?.role; // ✅ Get role from JWT
    console.log('AuthGuard - Validated Role:', userRole);

    if (state.url.startsWith('/dentistdashboard') && userRole !== 'dentist') {
      this.router.navigate(['/patientdashboard']);
      return false;
    }

    if (state.url.startsWith('/patientdashboard') && userRole !== 'patient') {
      this.router.navigate(['/dentistdashboard']);
      return false;
    }

    return true;
  }
}
