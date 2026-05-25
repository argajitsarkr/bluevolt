/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
  async rewrites() {
    // When the frontend is exposed via a single hostname (Tailscale Funnel,
    // nginx with a /api/ location, etc.), proxy /api/* through Next.js to
    // the backend container so the browser only sees one origin.
    const backend = process.env.BACKEND_INTERNAL_URL || "http://api:8000";
    return [{ source: "/api/:path*", destination: `${backend}/api/:path*` }];
  },
};
module.exports = nextConfig;
