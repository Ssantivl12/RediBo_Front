// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "./components/navbar/NavbarWrapper";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Sitio de Alquiler de Autos",
  description: "Proyecto de la U - Alquiler de vehículos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <header>
            <NavbarWrapper />
          </header>

          <main style={{ flexGrow: 1, backgroundColor: '#ffffff' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}