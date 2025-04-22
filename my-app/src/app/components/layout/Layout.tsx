"use client";

import { ReactNode } from "react";
import styles from "./Layout.module.css";
import { useRouter } from "next/navigation";
import "../../globals.css";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>REDIBO</h1>
        <button
          onClick={() => router.push("/filtroBusqueda")}
          style={{ backgroundColor: "#9CA3AF" }} // plomo (gris medio)
        >
          Buscar
        </button>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <p>&copy; 2025 REDIBO. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
