'use client';
import { useSearchParams } from 'next/navigation';
import VistaPago from '@/app/components/pago/VistaPago'

export default function Page() {
  const searchParams = useSearchParams();
  const monto = searchParams.get('monto');
  const id = searchParams.get('id');
  return <VistaPago />
}
