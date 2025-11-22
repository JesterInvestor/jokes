/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve = config.resolve || {}
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      porto: false,
      'porto/internal': false,
      '@react-native-async-storage/async-storage': false,
      'pino-pretty': false,
    }
    return config
  },
}

module.exports = nextConfig
