/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: false,
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    esmExternals: false,
  },
  // Disable TypeScript checks during development
  webpack: (config) => {
    config.infrastructureLogging = {
      level: 'error',
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      '@agency-management-panel': false
    };

    return config
  }
}

export default nextConfig