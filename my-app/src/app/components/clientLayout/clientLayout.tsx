'use client';

import { usePathname } from 'next/navigation';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Rutas donde NO querés que aparezca el footer
  const hiddenFooterRoutes = [
    '/home/homePage/userPerfil',
    '/home/terminos'
  ];

  const shouldShowFooter = !hiddenFooterRoutes.includes(pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Navbar />
      </header>
      <main className="flex-1 bg-white">{children}</main>
      {shouldShowFooter && <Footer />}
    </div>
  );
}
