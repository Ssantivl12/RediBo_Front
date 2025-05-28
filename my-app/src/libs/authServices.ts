// src/libs/authService.ts
import { BASE_URL } from "@/libs/autoServices";

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText ||"Error en login");
  }

  return res.json();
}

export const backendip = () => {
  return BASE_URL;
};
