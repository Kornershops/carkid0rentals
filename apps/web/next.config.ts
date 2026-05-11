import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove 'output: export' to enable API proxy in dev mode
  // output: "export",
  
  // API Proxy for development (single port convenience)
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:9090/api/v1/:path*',
      },
      {
        source: '/health',
        destination: 'http://localhost:9090/health',
      },
    ];
  },
  
  images: {
    loader: "custom",
    loaderFile: "./src/lib/cloudinary-loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    deviceSizes: [320, 480, 640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/webp", "image/avif"],
  },
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    // Disable lockfile patching that fails in npm workspaces
    swcPlugins: [],
  },
};

export default nextConfig;
