/** @type {import('next').NextConfig} */
const nextConfig = {
  // Temporarily disable basePath for local development
  // basePath: '/psychotherapist.ai',
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

export default nextConfig 