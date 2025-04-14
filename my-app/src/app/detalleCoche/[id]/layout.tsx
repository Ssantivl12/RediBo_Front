export default function DetalleLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="es">
        <body>
          <main>{children}</main>
        </body>
      </html>
    );
  }