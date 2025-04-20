'use client';

import React from "react";
import FiltersBar from "@components/filters/FiltersBar";
import CarListings from "@components/carListings/CarListings";
import Navbar from "@components/navbar/Navbar";

import LoginModal from "@components/auth/LoginModal";
import styles from "./GestionarSolicitudes.module.css";

export default function GestionarSolicitudes() {
  const [mostrarModal, setMostrarModal] = React.useState(false);
  const [activeFilter, setActiveFilter] = React.useState<string>('todos');

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  return (
    <div className={styles.container}>
      <header className={styles.headerTop}>
        <Navbar onLoginClick={() => setMostrarModal(true)} />
      </header>

      {mostrarModal && <LoginModal onClose={() => setMostrarModal(false)} />}
      
      <header className={styles.headerFilters}>
        <div className={styles.body}>
          <FiltersBar 
            onFilterChange={handleFilterChange} 
            activeFilter={activeFilter} 
          />
        </div>
      </header>

      <main className={styles.body}>
        <div className={styles.scrollContent}>
          <CarListings activeFilter={activeFilter} />
        </div>
      </main>
    </div>
  );
}