'use client';

import styles from './LoginModal.module.css';

export default function LoginModal({ onClose }: { onClose: () => void }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Iniciar sesión</h2>
        <input className={styles.input} type="text" placeholder="Usuario" />
        <input className={styles.input} type="password" placeholder="Contraseña" />
        <button className={styles.button}>Ingresar</button>
        <button className={styles.close} onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}
