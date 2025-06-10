export function getUserId(): string | null {
  // Check if running in browser environment
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return null;
    }

    try {
      // Decodificar el token JWT
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload);
      return payload.idUsuario || null;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }
  
  return null;
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}