export function getUserId(): string {
    // Check if running in browser environment
    if (typeof window !== 'undefined') {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No hay token de autenticación disponible');
      }

      return token;
    }
    
    // Return a default value during server-side rendering
    return '';
  }