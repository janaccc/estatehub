import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kidattzsjujqeigemzxa.supabase.co',
      },
    ],
  },
};

export default nextConfig;
