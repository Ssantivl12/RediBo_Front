import { Auto } from '@/types/auto';
import { notFound } from 'next/navigation';
import DetalleCocheCliente from './detalleCocheCliente';

interface DetalleCocheProps {
  params: { id: string };
}

export default async function DetalleCoche({ params }: DetalleCocheProps) {
  const { id } = await params;
  const res = await fetch(`http://localhost:4000/api/autos/${id}`);
  if (!res.ok) notFound();

  const data = await res.json();
  const auto: Auto = data.data;

  return <DetalleCocheCliente auto={auto} />;
}
