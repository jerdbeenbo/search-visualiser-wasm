/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config: { experiments: any; }) {
    // Enable WebAssembly support
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    
    return config;
  },
};

module.exports = nextConfig;