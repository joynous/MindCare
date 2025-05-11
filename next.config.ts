import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: isDevelopment ? 60 : 60 * 60 * 24, // 1 min in dev, 1 day in prod
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: isDevelopment 
              ? 'no-cache, no-store, max-age=0, must-revalidate'
              : 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: isDevelopment
              ? 'no-cache, no-store, max-age=0, must-revalidate'
              : 'public, max-age=604800, must-revalidate', // 1 week
          },
        ],
      },
    ];
  },
  experimental: {
    staleTimes: {
      dynamic: isDevelopment ? 30 : 60, // seconds
      static: isDevelopment ? 30 : 120,
    },
  },
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  },
  onDemandEntries: {
    maxInactiveAge: isDevelopment ? 60 * 1000 : 25 * 1000,
    pagesBufferLength: 5,
  },
  distDir: '.next',
  output: 'standalone'
};

export default nextConfig;