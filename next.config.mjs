/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['mongodb'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  env: {
    CUSTOM_KEY: 'groupxam-study-app',
  },
  async rewrites() {
    return [
      {
        source: '/.well-known/appspecific/:path*',
        destination: '/api/devtools',
      },
    ]
  },
}

export default nextConfig
