/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },

  // Image optimization
  images: {
    domains: ['localhost', 'supabase.co'],
    formats: ['image/webp', 'image/avif']
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Handle PDF generation libraries
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/overview',
        permanent: false
      }
    ];
  }
};

module.exports = nextConfig;