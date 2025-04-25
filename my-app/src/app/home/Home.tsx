'use client';

import { useState } from 'react';
import FiltersBar from '../components/filters/FiltersBar';
import Footer from '../components/footer/Footer';
import LoginModal from '../components/auth/LoginModal';
import styles from './Home.module.css';

export default function HomePage() {
  const [mostrarModal, setMostrarModal] = useState(false);

  return (
    <div className={styles.container}>
      <header className={styles.headerTop}>
      </header>

      <header className={styles.headerFilters}>
        <FiltersBar />
      </header>

      <main className={styles.body}>
        <div className={styles.scrollContent}>
          <p>Contenido principal del usuario (tarjetas, información, etc.).</p>
        </div>
      </main>

      <footer>
        <Footer />
      </footer>

      {mostrarModal && <LoginModal onClose={() => setMostrarModal(false)} />}
    </div>
  );
}