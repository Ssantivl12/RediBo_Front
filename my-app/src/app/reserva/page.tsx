'use client';
import { useSearchParams } from 'next/navigation';
import ReservaActiva from '@/app/components/reserva/ReservaActiva';

export default function Page() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  return <ReservaActiva vehiculoId={id} />;
}
