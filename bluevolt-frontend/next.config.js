/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
  async rewrites() {
    // IMPORTANT: only proxy the versioned API path (/api/v1/*) to FastAPI.
    // /api/auth/* MUST stay on Next.js for NextAuth to work.
    const backend = process.env.BACKEND_INTERNAL_URL || "http://api:8000";
    return [{ source: "/api/v1/:path*", destination: `${backend}/api/v1/:path*` }];
  },
};
module.exports = nextConfig;
