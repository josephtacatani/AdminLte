import { jwtDecode } from 'jwt-decode';

export function decodeAccessToken(): { id: number; role: string } | null {
  const token = sessionStorage.getItem('accessToken');
  if (!token) return null;

  try {
    return jwtDecode<{ id: number; role: string }>(token); // ✅ Correct import
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}
