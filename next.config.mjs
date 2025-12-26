import createNextIntlPlugin from 'next-intl/plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  transpilePackages: ['firebase', 'next-intl'],
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  trailingSlash: true,
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  turbopack: {
    root: process.cwd(),
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins = config.plugins || [];
      const hasMiniCssExtractPlugin = config.plugins.some(
        (plugin) => plugin.constructor.name === 'MiniCssExtractPlugin'
      );

      if (!hasMiniCssExtractPlugin) {
        config.plugins.push(
          new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash:8].css',
            chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
          })
        );
      }
    }
    return config;
  },
};

export default withNextIntl(nextConfig);

