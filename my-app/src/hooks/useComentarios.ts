// src/hooks/useComentarios.ts
import { useEffect, useState } from 'react';
import { Comentario } from '@/types/auto';

export function useComentarios(autoId: number) {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:4000/api/autos/${autoId}/comentarios`)
      .then((res) => res.json())
      .then((data) => {
        setComentarios(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al obtener comentarios:', err);
        setError('No se pudieron cargar los comentarios.');
        setLoading(false);
      });
  }, [autoId]);

  return { comentarios, loading, error };
}
