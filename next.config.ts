import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/admin.html',
        destination: '/admin',
        permanent: true,
      },
      {
        source: '/login.html',
        destination: '/admin/login',
        permanent: true,
      },
    ];
  },
  // Explicitly trace the SQLite database file for Vercel serverless functions
  // so it doesn't get stripped from the production API bundles
  outputFileTracingIncludes: {
    '/api/**/*': ['./dev.db'],
  },
};

export default nextConfig;
