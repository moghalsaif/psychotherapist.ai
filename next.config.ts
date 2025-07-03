import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Temporarily disable basePath for local development  
  // basePath: '/psychotherapist.ai',
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Disable server-side features since GitHub Pages is static
  trailingSlash: true,
};

export default nextConfig;
