import DetalleHost from './detalleHost';
import { getComentariosDeHost } from '@/libs/api';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const { data: comentarios } = await getComentariosDeHost(id);
    return <DetalleHost id = {id} comentarios={comentarios} />;
  } catch (error) {
    console.error('Error cargando datos del host:', error);
    return <div>Error al cargar el perfil del host.</div>;
  }
}
