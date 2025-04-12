import { Auto } from '@/types/auto';
import { notFound } from 'next/navigation';

interface DetalleCocheProps {
  params: {
    id: string;
  };
}

export default async function DetalleCoche({ params }: DetalleCocheProps) {
  const { id } = params;

  // Realiza la solicitud a tu API para obtener los datos del auto
  const res = await fetch(`http://localhost:4000/api/autos/${id}`);

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();
  const auto: Auto = data.data;

  return (
    <div>
      <h1>Detalles del Auto</h1>
      <p><strong>Marca:</strong> {auto.marca}</p>
      <p><strong>Modelo:</strong> {auto.modelo}</p>
      <p><strong>Kilometraje:</strong> {auto.kilometraje}</p>
      <p><strong>Transmisión:</strong> {auto.transmision}</p>
      <p><strong>Combustible:</strong> {auto.combustible}</p>
    </div>
  );
}
