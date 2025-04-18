'use client';

import React from "react";
import FiltersBar from "@/app/components/filters/FiltersBar";
import CarListings from "../components/carListings/CarListings";
import Navbar from "../components/navbar/Navbar";
import styles from "./requests.module.css";

export default function SolicitudesPage() {
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