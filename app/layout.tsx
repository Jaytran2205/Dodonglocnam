import type { Metadata } from "next";
import { Noto_Serif, Inter } from "next/font/google";
import "./globals.css";

const notoSerif = Noto_Serif({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Đồ Đồng Lộc Nam | Đúc Đồng Ý Yên Nam Định - Tượng Đồng Chân Dung, Đồ Thờ Cúng Cao Cấp",
  description: "Đồ Đồng Lộc Nam - Thương hiệu đúc đồng truyền thống Ý Yên, Nam Định. Chuyên đúc đồng chân dung truyền thần, đồ thờ cúng bằng đồng, tượng đồng phong thủy, trống đồng, chuông đồng đẹp và tinh xảo bậc nhất.",
  keywords: [
    "đồ đồng lộc nam",
    "đồ đồng nam định",
    "đúc đồng chân dung",
    "đúc tượng chân dung",
    "đồ đồng đẹp",
    "đồ thờ cúng bằng đồng",
    "xưởng đúc đồng ý yên",
    "tượng đồng phong thủy",
    "trống đồng đông sơn",
    "tranh đồng mỹ nghệ",
    "đúc chuông đồng",
    "đồ đồng cao cấp"
  ].join(", "),
  authors: [{ name: "Đồ Đồng Lộc Nam" }],
  creator: "Đồ Đồng Lộc Nam",
  publisher: "Đồ Đồng Lộc Nam",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  metadataBase: new URL("https://www.quatanglocnam.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Đồ Đồng Lộc Nam | Đúc Đồng Chân Dung & Đồ Đồng Nam Định Đẹp Tinh Xảo",
    description: "Xưởng đúc đồng Lộc Nam - Đỉnh cao nghệ thuật đúc đồng truyền thống Nam Định. Chuyên đúc tượng đồng chân dung, đỉnh đồng thờ cúng, tượng danh nhân, tranh đồng mạ vàng cao cấp.",
    url: "https://www.quatanglocnam.com",
    siteName: "Đồ Đồng Lộc Nam",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Đồ Đồng Lộc Nam - Tinh hoa đúc đồng Việt",
      }
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Đồ Đồng Lộc Nam",
    "alternateName": "Đồ Đồng Lộc Nam - Đúc Đồng Ý Yên Nam Định",
    "image": "https://www.quatanglocnam.com/images/logo.png",
    "telephone": ["0836122222", "0846699997"],
    "email": "dodonglocnam1102@gmail.com",
    "url": "https://www.quatanglocnam.com",
    "priceRange": "VNĐ",
    "hasMap": "https://maps.app.goo.gl/5rQAVSTNhDzQtMebA",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Đường 57A - Thị trấn Lâm",
      "addressLocality": "Ý Yên",
      "addressRegion": "Nam Định",
      "postalCode": "420000",
      "addressCountry": "VN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 20.3789,
      "longitude": 106.0124
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
      ],
      "opens": "08:00",
      "closes": "21:00"
    },
    "sameAs": [
      "https://facebook.com/dodonglocnam",
      "https://youtube.com/dodonglocnam"
    ]
  };

  return (
    <html lang="vi" className={`${notoSerif.variable} ${inter.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        {/* GEO Meta Tags for Local SEO & Google Maps */}
        <meta name="geo.region" content="VN-13" />
        <meta name="geo.placename" content="Ý Yên, Nam Định, Việt Nam" />
        <meta name="geo.position" content="20.3789;106.0124" />
        <meta name="ICBM" content="20.3789, 106.0124" />
        <link rel="icon" href="/images/logo.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;
                function isExtensionError(msg, src, err) {
                  var str = (msg || '') + ' ' + (src || '') + ' ' + (err && err.stack ? err.stack : '');
                  return str.indexOf('chrome-extension://') !== -1 ||
                         str.indexOf('moz-extension://') !== -1 ||
                         str.indexOf('M_ID') !== -1 ||
                         str.indexOf('executors') !== -1;
                }
                window.addEventListener('error', function(e) {
                  if (isExtensionError(e.message, e.filename, e.error)) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    return true;
                  }
                }, true);
                window.addEventListener('unhandledrejection', function(e) {
                  if (e.reason && isExtensionError(e.reason.message, '', e.reason)) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                  }
                }, true);
              })();
            `
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-background text-on-background font-sans antialiased selection:bg-primary selection:text-on-primary min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}