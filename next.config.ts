import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  images: {
    // This TTL affects how long Next caches the *source* image before refetching.
    minimumCacheTTL: isDevelopment ? 60 : 60 * 60 * 24,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  async headers() {
    return [
      // Build assets: immutable long cache
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: isDevelopment
              ? "no-cache, no-store, max-age=0, must-revalidate"
              : "public, max-age=31536000, immutable",
          },
        ],
      },

      // Image optimizer: allow browser + CDN cache and fast revalidation
      {
        source: "/_next/image/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: isDevelopment
              ? "no-cache, no-store, max-age=0, must-revalidate"
              : [
                  "public",
                  "max-age=604800",          // 1 week in the browser
                  "s-maxage=604800",         // 1 week at the CDN/edge
                  "stale-while-revalidate=86400" // serve stale for a day while revalidating
                ].join(", "),
          },
        ],
      },

      // Forms / PII should never be shared-cached
      {
        source: "/events/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
        ],
      },
    ];
  },

  experimental: {
    staleTimes: {
      dynamic: isDevelopment ? 30 : 60,
      static: isDevelopment ? 30 : 120,
    },
  },

  devIndicators: {
    position: "bottom-right",
  },

  // Dev-only; ignored in prod, but keep explicit
  onDemandEntries: isDevelopment
    ? { maxInactiveAge: 60_000, pagesBufferLength: 5 }
    : undefined,

  distDir: ".next",
  output: "standalone",
};

export default nextConfig;
