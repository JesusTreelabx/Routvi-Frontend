import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  output: 'export',      // <--- Crucial para generar archivos estáticos
  images: {
    unoptimized: true,   // S3 no puede procesar imágenes dinámicamente
  },
};

export default nextConfig;
