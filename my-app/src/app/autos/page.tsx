
import { getAutos } from '@/libs/api';
import { Auto } from '@/types/auto';

import styles from './listaAutos.module.css';

export default async function AutosPage() {
  const { data: autos } = await getAutos();

  return (
    <div className={styles.container}>
    <h1 className={styles.h1}>Lista de Autos</h1>
    <ul className={styles.ul}>
        {autos.map((auto: Auto) => (
        <li key={auto.idAuto} className={styles.li}>
            <p><strong>Marca:</strong> {auto.marca}</p>
            <p><strong>Modelo:</strong> {auto.modelo}</p>
            <p><strong>Kilometraje:</strong> {auto.kilometraje} </p>
            <p><strong>Transmision:</strong> {auto.transmision} </p>
            <p><strong>Combustible:</strong> {auto.combustible} </p>
            <button className={styles.button}>Ver detalles</button>
        </li>
        ))}
    </ul>
    </div>
  );
}