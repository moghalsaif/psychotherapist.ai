/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/psychotherapist.ai',
  trailingSlash: true,
}

export default nextConfig 