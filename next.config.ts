import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  // For Static Export
  // output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    // Additional Sass options can go here
  },

  eslint: {
    ignoreDuringBuilds: true, // ✅ باعث میشه ارور ESLint مانع build نشه
  },

  // ✅ اضافه کردن allowedDevOrigins برای رفع هشدار cross-origin
  allowedDevOrigins: [
    'http://192.168.100.33:3000', // آی‌پی و پورت که ازش درخواست میاد
    'http://localhost:3000',      // اختیاری، اگر لازم داری
  ],
};

export default nextConfig;
