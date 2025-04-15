import NavbarDetalle from "@/app/components/navbar/NavbarDetalle";

export default function DetalleLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="es">
        <body> 
          <NavbarDetalle/>
          <main>{children}</main>
        </body>
      </html>
    );
  }