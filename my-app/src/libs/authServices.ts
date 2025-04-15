// src/libs/authService.ts

export async function login(email: string, password: string) {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  
    if (!res.ok) {
      throw new Error('Error en login');
    }
  
    return res.json();
  }