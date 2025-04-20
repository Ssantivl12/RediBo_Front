"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import LoginModal from './components/auth/LoginModal';

export default function Home() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const router = useRouter();

  const navegarAPagarRenta = () => {
    router.push('/rentador/pagarRenta/1');
  };

  return (
    <div className={styles.container}>
      <header className={styles.headerTop}>
        <Navbar onLoginClick={() => setMostrarModal(true)} />
      </header>
      
      {mostrarModal && <LoginModal onClose={() => setMostrarModal(false)} />}
      
      <main className={styles.main}>
        <h1 className={styles.title}>
          Bienvenido a REDIBO
        </h1>
        
        <div className={styles.description}>
          <p>
            Sistema de gestión de rentas y pagos
          </p>
        </div>
        
        <div className={styles.groupsContainer}>
          {/* Sección del Grupo CodeLovers */}
          <div className={styles.groupSection}>
            <h2 className={styles.groupTitle}>Grupo CodeLovers</h2>
            <div className={styles.groupContent}>
              <p>Funcionalidades del equipo de desarrollo CodeLovers:</p>
              <button 
                className={styles.button}
                onClick={navegarAPagarRenta}
              >
                Pagar Renta
              </button>
            </div>
          </div>

          {/* Sección para otro grupo de ejemplo */}
          {/*
          <div className={styles.groupSection}>
            <h2 className={styles.groupTitle}>Grupo X</h2>
            <div className={styles.groupContent}>
              <p>Funcionalidades del equipo X:</p>
              <button 
                className={styles.button}
                onClick={() => router.push('/rentador/historial')}
              >
                Ver Historial De Pagos
              </button>
            </div>
          </div>
          */}
        </div>
      </main>
      
      <footer>
        <Footer />
      </footer>
    </div>
  );
}