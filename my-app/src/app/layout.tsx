import "./globals.css";
import ClientLayout from "@/app/components/clientLayout/clientLayout";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
