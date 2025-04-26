import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Esto hace que los errores de ESLint sean ignorados en producción
  },
  // Puedes añadir más configuraciones aquí si es necesario
};

export default nextConfig;
