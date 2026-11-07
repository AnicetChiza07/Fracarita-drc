import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Configuration pour le monorepo (Turbopack)
  turbopack: {
    root: path.resolve(__dirname, "../../"),
  },
  
  // Autoriser les images externes (Unsplash + Wikimedia + UploadThing)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      // ✅ AJOUT : Autoriser les images hébergées sur UploadThing
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
        pathname: '/f/**', 
      },
    ],
  },
};

export default nextConfig;