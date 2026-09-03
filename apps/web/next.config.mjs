/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@pulsecommerce/ui", "@pulsecommerce/db", "@pulsecommerce/validators"],
};

export default nextConfig;
