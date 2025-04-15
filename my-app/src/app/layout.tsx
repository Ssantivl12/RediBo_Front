// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "./components/navbar/NavbarWrapper";
import Footer from "./components/footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
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