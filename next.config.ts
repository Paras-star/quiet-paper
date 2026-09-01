import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev-only. Default allowlist is localhost, not 127.0.0.1 or the hosted
  // preview host. Binding 0.0.0.0 lets the preview proxy reach the server;
  // these origins let client chunks load (hydration) from those URLs.
  allowedDevOrigins: ["127.0.0.1", "*.agent.cvm.dev"],
  experimental: {
    // Hosted preview: browser Origin is *.agent.cvm.dev while the proxy sets
    // x-forwarded-host to *.cursorvm.com. Next.js aborts Server Actions unless
    // the Origin host is allowlisted here.
    serverActions: {
      allowedOrigins: ["*.agent.cvm.dev", "*.cursorvm.com"],
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;
