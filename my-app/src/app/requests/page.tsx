// /app/solicitudes/page.tsx
'use client';

import React from "react";
import FiltersBar from "@/app/components/filters/FiltersBar";
import Navbar from "../components/navbar/Navbar";
import styles from "./requests.module.css";

export default function SolicitudesPage() {
  const handleFilterChange = (filter: any) => {
    console.log("Filtro cambiado:", filter);
  };

    const [mostrarModal, setMostrarModal] = React.useState(false);

  const [activeFilter, setActiveFilter] = React.useState<string>('');

  return (
    <div className={styles.container}>
      <header className={styles.headerTop}>
        <Navbar onLoginClick={() => setMostrarModal(true)} />
      </header>

      <header className={styles.headerFilters}>
        <div className={styles.body}>
        <FiltersBar onFilterChange={handleFilterChange} />
        </div>
      </header>

      <main className={styles.body}>
      
      </main>

    </div>
  );
}
