import { Auto, Comentario } from '@/types/auto';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function getAutos(): Promise<{ data: Auto[] }> {
  const res = await fetch(`${BASE_URL}/autos`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al obtener autos');
  return res.json();
}

export async function getAutoPorId(id: string): Promise<{ data: Auto }> {
  const res = await fetch(`${BASE_URL}/autos/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Auto no encontrado');
  return res.json();
}

export async function getComentariosDeAuto(autoId: number): Promise<{ data: Comentario[] }> {
  const res = await fetch(`${BASE_URL}/autos/${autoId}/comentarios`, { cache: 'no-store' });
  if (!res.ok) throw new Error('No se pudieron cargar los comentarios');
  return res.json();
}
