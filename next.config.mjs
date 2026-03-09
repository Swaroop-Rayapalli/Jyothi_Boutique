/** @type {import('next').NextConfig} */
const nextConfig = {
    // Explicitly trace the SQLite database file for Vercel serverless functions
    // so it doesn't get stripped from the production API bundles
    outputFileTracingIncludes: {
        '/api/**/*': ['./dev.db'],
    },
};

export default nextConfig;
