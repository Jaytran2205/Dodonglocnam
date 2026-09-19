/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  redirects: async () => [
    {
      source: '/san-pham/tuong-dong/tuong-linh-vat-12-con-giap',
      destination: '/san-pham/tuong-dong/tuong-12-con-giap',
      permanent: true,
    },
    {
      source: '/san-pham/tuong-dong/tuong-linh-vat-12-con-giap/:path*',
      destination: '/san-pham/tuong-dong/tuong-12-con-giap/:path*',
      permanent: true,
    },
    {
      source: '/san-pham/tuong-dong/tuong-chan-dung-truyen-than',
      destination: '/san-pham/tuong-dong/tuong-truyen-than',
      permanent: true,
    },
    {
      source: '/san-pham/tuong-dong/tuong-chan-dung-truyen-than/:path*',
      destination: '/san-pham/tuong-dong/tuong-truyen-than/:path*',
      permanent: true,
    },
    {
      source: '/san-pham/tuong-dong/tuong-12-con-giap/tuong-rong-bang-dong',
      destination: '/san-pham/tuong-dong/tuong-12-con-giap/tuong-rong',
      permanent: true,
    },
    {
      source: '/san-pham/tranh-dong/tranh-danh-nhan-bang-dong',
      destination: '/san-pham/tranh-dong/tranh-danh-nhan',
      permanent: true,
    },
    {
      source: '/san-pham/tranh-dong/tranh-danh-nhan-bang-dong/:path*',
      destination: '/san-pham/tranh-dong/tranh-danh-nhan/:path*',
      permanent: true,
    },
    {
      source: '/san-pham/tuong-dong/tuong-danh-nhan/tuong-khong-minh',
      destination: '/san-pham/tuong-dong/tuong-danh-nhan/tuong-gia-cat-luong',
      permanent: true,
    },
    {
      source: '/san-pham/qua-tang-dong',
      destination: '/qua-tang',
      permanent: true,
    },
    {
      source: '/san-pham/qua-tang-dong/:path*',
      destination: '/qua-tang/:path*',
      permanent: true,
    },
    {
      source: '/san-pham/qua-tang',
      destination: '/qua-tang',
      permanent: true,
    },
    {
      source: '/san-pham/qua-tang/:path*',
      destination: '/qua-tang/:path*',
      permanent: true,
    },
    {
      source: '/qua-tang/doi-tac',
      destination: '/qua-tang/qua-tang-doanh-nghiep',
      permanent: true,
    },
    {
      source: '/qua-tang/doi-tac/:path*',
      destination: '/qua-tang/qua-tang-doanh-nghiep/:path*',
      permanent: true,
    },
    {
      source: '/qua-tang/qua-tang-doi-tac',
      destination: '/qua-tang/qua-tang-doanh-nghiep',
      permanent: true,
    },
    {
      source: '/qua-tang/qua-tang-doi-tac/:path*',
      destination: '/qua-tang/qua-tang-doanh-nghiep/:path*',
      permanent: true,
    },
    {
      source: '/qua-tang/qua-tang-doi-tuong',
      destination: '/qua-tang/qua-tang-doanh-nghiep',
      permanent: true,
    },
    {
      source: '/qua-tang/qua-tang-doi-tuong/:path*',
      destination: '/qua-tang/qua-tang-doanh-nghiep/:path*',
      permanent: true,
    },
    {
      source: '/qua-tang/qua-tang-ky-niem',
      destination: '/qua-tang/qua-tang-luu-niem',
      permanent: true,
    },
    {
      source: '/qua-tang/qua-tang-ky-niem/:path*',
      destination: '/qua-tang/qua-tang-luu-niem/:path*',
      permanent: true,
    },
    {
      source: '/qua-tang/luu-niem',
      destination: '/qua-tang/qua-tang-luu-niem',
      permanent: true,
    },
    {
      source: '/qua-tang/luu-niem/:path*',
      destination: '/qua-tang/qua-tang-luu-niem/:path*',
      permanent: true,
    },
    {
      source: '/qua-tang/su-kien',
      destination: '/qua-tang/qua-tang-su-kien',
      permanent: true,
    },
    {
      source: '/qua-tang/su-kien/:path*',
      destination: '/qua-tang/qua-tang-su-kien/:path*',
      permanent: true,
    },
    {
      source: '/qua-tang/phong-thuy',
      destination: '/qua-tang/qua-tang-phong-thuy',
      permanent: true,
    },
    {
      source: '/qua-tang/phong-thuy/:path*',
      destination: '/qua-tang/qua-tang-phong-thuy/:path*',
      permanent: true,
    },
  ],
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()',
        },
      ],
    },
    {
      source: '/images/:all*(svg|jpg|jpeg|png|webp|gif|ico)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      source: '/fonts/:all*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      source: '/_next/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
  rewrites: async () => [
    {
      source: '/gioi-thieu/:slug',
      destination: '/tin-tuc/:slug',
    },
  ],
};

export default nextConfig;

