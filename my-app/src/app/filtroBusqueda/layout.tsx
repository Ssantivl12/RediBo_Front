import '../globals.css'

export const metadata = {
  generator: 'REDIBO'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>REDIBO</title>
        <meta name="description" content="REDIBO Busqueda de Vehiculos" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
