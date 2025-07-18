/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["bcryptjs"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
     allowedDevOrigins: [
      '169.254.8.152',  // Add detected IP
      'localhost'        // Default development origin
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
