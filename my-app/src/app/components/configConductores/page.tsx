'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ConfigConductores from '@/app/components/detalleReserva/configConductores';

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando configuración de conductores...</div>}>
      <ConfigConductoresContent />
    </Suspense>
  );
}

function ConfigConductoresContent() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get('idReserva');
  const idReserva = idParam ? parseInt(idParam) : null;

  return <ConfigConductores idReserva={idReserva} />;
}