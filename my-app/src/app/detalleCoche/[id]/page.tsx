import { Auto } from '@/types/auto';
import { notFound } from 'next/navigation';
import styles from './detalleCoche.module.css';

interface DetalleCocheProps {
  params: {
    id: string;
  };
}

export default async function DetalleCoche({ params }: DetalleCocheProps) {
  const { id } = params;

  const res = await fetch(`http://localhost:4000/api/autos/${id}`);
  if (!res.ok) notFound();

  const data = await res.json();
  const auto: Auto = data.data;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{auto.marca} {auto.modelo}</h1>

      <div className={styles.content}>
        <div className={styles.imagePlaceholder}>Imagen del auto</div>

        <div className={styles.carInfo}>
          <p><span className={styles.label}>Kilometraje:</span> {auto.kilometraje}</p>
          <p><span className={styles.label}>Transmisión:</span> {auto.transmision}</p>
          <p><span className={styles.label}>Combustible:</span> {auto.combustible}</p>
        </div>

        <div className={styles.pricing}>
          <h3>Desglose del precio</h3>
          <p><span className={styles.label}>Precio por día:</span> 753 BOB</p>
          <p><span className={styles.label}>Precio total:</span> 5197.5 BOB</p>
        </div>
      </div>
    </div>
  );
}
