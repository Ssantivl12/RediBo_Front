import { notFound } from 'next/navigation';
import DetalleCocheCliente from './detalleCocheCliente';
import { getAutoPorId } from '@/libs/api';

export default async function Page(props: { params: { id: string } }) {
  const params = props.params; // forzar evaluación sin await

  try {
    const { data: auto } = await getAutoPorId(params.id);
    return <DetalleCocheCliente auto={auto} />;
  } catch {
    return notFound();
  }
}
