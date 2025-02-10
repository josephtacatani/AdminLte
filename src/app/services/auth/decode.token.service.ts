import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class DecodeTokenService {
  constructor() {}

  decodeAccessToken(): { id: number; role: string } | null {
    const token = sessionStorage.getItem('accessToken');
    if (!token) return null;

    try {
      return jwtDecode<{ id: number; role: string }>(token);
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }

  getUserId(): number | null {
    const userData = this.decodeAccessToken();
    return userData?.id ?? null;
  }
}
