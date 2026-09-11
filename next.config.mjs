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
  images: {
    formats: ['image/avif', 'image/webp'],
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
      destination: '/qua-tang/qua-tang-doi-tuong',
      permanent: true,
    },
    {
      source: '/qua-tang/doi-tac/:path*',
      destination: '/qua-tang/qua-tang-doi-tuong/:path*',
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
      source: '/images/:all*(svg|jpg|jpeg|png|webp|gif|ico)',
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
};

export default nextConfig;

