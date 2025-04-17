// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NotificationProvider } from "./components/Context/NotificationContext";
import NotificationList from "./components/Notifications/NotificationList";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RediBo",
  description: "Sistema de alquiler de autos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <NotificationProvider>
          {children}
          <NotificationList />
        </NotificationProvider>
      </body>
    </html>
  );
}

