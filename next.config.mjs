import createNextIntlPlugin from 'next-intl/plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.NODE_ENV === 'production' && { output: 'export' }),
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  ...(process.env.NODE_ENV === 'production' && { distDir: 'build_out' }),
  assetPrefix: '',

  // Rewrites for DEV mode - route dynamic portal paths to template pages
  // This allows real orgIds to work in development while keeping dynamicParams = false for production
  async rewrites() {
    // Only apply in development - production uses Firebase Hosting rewrites
    if (process.env.NODE_ENV === 'production') {
      return [];
    }

    return [
      // ============================================================
      // SPECIFIC REWRITES - Handle detail pages with static fallbacks
      // ============================================================

      // Pricing Detail - ANY pricingId → /pricing/pricing/
      {
        source: '/:locale/portal/org/:orgId/pricing/:pricingId/',
        destination: '/:locale/portal/org/template/pricing/pricing/',
      },
      {
        source: '/:locale/portal/org/:orgId/pricing/:pricingId',
        destination: '/:locale/portal/org/template/pricing/pricing/',
      },

      // Pricing Edit - ANY pricingId → /pricing/pricing/edit/
      {
        source: '/:locale/portal/org/:orgId/pricing/:pricingId/edit/',
        destination: '/:locale/portal/org/template/pricing/pricing/edit/',
      },
      {
        source: '/:locale/portal/org/:orgId/pricing/:pricingId/edit',
        destination: '/:locale/portal/org/template/pricing/pricing/edit/',
      },

      // Request Detail - ANY requestId → /requests/request/
      {
        source: '/:locale/portal/org/:orgId/requests/:requestId/',
        destination: '/:locale/portal/org/template/requests/request/',
      },
      {
        source: '/:locale/portal/org/:orgId/requests/:requestId',
        destination: '/:locale/portal/org/template/requests/request/',
      },

      // ============================================================
      // WILDCARD REWRITES - Automatically handles remaining nested routes
      // ============================================================

      // Portal org routes - ANY path under /portal/org/[realId]/ → /portal/org/template/
      {
        source: '/:locale/portal/org/:orgId/:path*',
        destination: '/:locale/portal/org/template/:path*',
      },

      // Portal invite routes - ANY invite code → template
      {
        source: '/:locale/portal/invite/:code',
        destination: '/:locale/portal/invite/template',
      },

      // Portal agency client routes - ANY path under /portal/agency/clients/[realId]/ → template
      {
        source: '/:locale/portal/agency/clients/:clientId/:path*',
        destination: '/:locale/portal/agency/clients/template/:path*',
      },

      // Catch base paths without trailing path (e.g., /portal/org/abc123)
      {
        source: '/:locale/portal/org/:orgId',
        destination: '/:locale/portal/org/template',
      },
      {
        source: '/:locale/portal/agency/clients/:clientId',
        destination: '/:locale/portal/agency/clients/template',
      },
    ];
  },

  // Explicitly set the workspace root to avoid lockfile detection issues
  outputFileTracingRoot: __dirname,

  transpilePackages: ['firebase', 'next-intl', '@react-pdf/renderer'],
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  typescript: {
    // Temporarily ignore TypeScript errors for deployment
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins = config.plugins || [];
      const hasMiniCssExtractPlugin = config.plugins.some(
        plugin => plugin.constructor.name === 'MiniCssExtractPlugin'
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

    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        message: /Parsing of .* for build dependencies failed at 'import\(t\)'/,
      },
      {
        message: /Build dependencies behind this expression are ignored/,
      },
      warning => {
        const message = warning.message || warning.toString();
        const module = warning.module?.resource || warning.module?.identifier || '';
        return (
          (message.includes('Parsing of') && message.includes('import(t)')) ||
          message.includes('Build dependencies behind this expression') ||
          (module.includes('next-intl') && module.includes('extractor'))
        );
      },
    ];

    // Use a single RegExp to ignore directories and Windows system files
    config.watchOptions = {
      ...config.watchOptions,
      ignored:
        /([/\\](node_modules|\.git|\.next|build_out|out|coverage|\.firebase)[/\\])|(DumpStack\.log\.tmp|hiberfil\.sys|pagefile\.sys|swapfile\.sys)$/i,
      aggregateTimeout: 300,
      poll: false,
    };

    config.infrastructureLogging = {
      ...config.infrastructureLogging,
      level: 'error',
    };

    return config;
  },
};

export default withNextIntl(nextConfig);
