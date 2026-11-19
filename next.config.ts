import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Hero banners (and later product photos) come from the brand's folder on S3.
    remotePatterns: [new URL("https://aawsite.s3.ap-south-1.amazonaws.com/illaffashion/**")],
  },
};

export default nextConfig;
