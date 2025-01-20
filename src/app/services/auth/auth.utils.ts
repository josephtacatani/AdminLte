export function decodeAccessToken(): any {
    const token = sessionStorage.getItem('accessToken');
    if (!token) return null;
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // ✅ Decode JWT payload
      return payload; // Returns { id: "123", role: "patient" }
    } catch (e) {
      console.error('Invalid token:', e);
      return null;
    }
  }
  