import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/admin/seo",
        destination: "/admin/leads",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
