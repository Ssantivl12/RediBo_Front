//'use client';
import { getAutos } from '@/libs/api';
import { Auto } from '@/types/auto';

import styles from './listaAutos.module.css';

export default async function AutosPage() {
  const { data: autos } = await getAutos();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lista de Autos</h1>
      <div className={styles.grid}>
        {autos.map((auto: Auto) => (
          <div key={auto.idAuto} className={styles.card}>
            <div className={styles.imagePlaceholder}>Imagen del auto</div>
            <div className={styles.info}>
              <p><span className={styles.label}>Marca:</span> {auto.marca}</p>
              <p><span className={styles.label}>Modelo:</span> {auto.modelo}</p>
              <p><span className={styles.label}>Kilometraje:</span> {auto.kilometraje}</p>
              <p><span className={styles.label}>Transmisión:</span> {auto.transmision}</p>
              <p><span className={styles.label}>Combustible:</span> {auto.combustible}</p>
              <a className={styles.button} href={`/detalleCoche/${auto.idAuto}`} target="_blank">
                Ver detalles
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
