/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // This matches all routes
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-Requested-With, Access-Control-Allow-Headers, Content-Type, Authorization, Origin, Accept",
          },
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://*.clickup.com https://app.clickup.com",
          },
          {
            key: "X-Frame-Options",
            value: "ALLOWALL",
          },
        ],
      },
    ];
  },
  // Enable App Router
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
