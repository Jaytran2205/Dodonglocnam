import React from "react";

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ProductJsonLdProps {
  name: string;
  description: string;
  images: string[];
  price?: number | null;
  categoryName: string;
  url: string;
  sku?: string;
}

export function ProductJsonLd({
  name,
  description,
  images,
  price,
  categoryName,
  url,
  sku,
}: ProductJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: name,
    image: images.length > 0 ? images : ["https://dodonglocnam.com/images/hero_golden_ship.jpg"],
    description: description || `Sản phẩm mỹ nghệ thủ công ${name} cao cấp từ Đồ Đồng Lộc Nam`,
    sku: sku || `LOCNAM-${name.replace(/\s+/g, "-").toUpperCase()}`,
    category: categoryName,
    brand: {
      "@type": "Brand",
      name: "Đồ Đồng Lộc Nam",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "48",
      bestRating: "5",
      worstRating: "1",
    },
    offers: {
      "@type": "Offer",
      url: url,
      priceCurrency: "VND",
      price: price ? price.toString() : "0",
      priceValidUntil: "2028-12-31",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Đồ Đồng Lộc Nam",
        url: "https://dodonglocnam.com",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqJsonLd({ faqs }: { faqs: FaqItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ArticleJsonLdProps {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  author: string;
  url: string;
}

export function ArticleJsonLd({
  title,
  description,
  image,
  datePublished,
  author,
  url,
}: ArticleJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description,
    image: image,
    datePublished: datePublished,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "Đồ Đồng Lộc Nam",
      logo: {
        "@type": "ImageObject",
        url: "https://dodonglocnam.com/images/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function LocalBusinessJsonLd({
  name = "Đồ Đồng Lộc Nam",
  hotline = "0836 122 222 - 0846 699 997",
  url = "https://dodonglocnam.com",
}: {
  name?: string;
  hotline?: string;
  url?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: name,
    image: "https://dodonglocnam.com/images/logo.png",
    "@id": "https://dodonglocnam.com/#localbusiness",
    url: url,
    telephone: ["0836122222", "0846699997"],
    priceRange: "500000 - 500000000 VND",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Đường 57A - Thị trấn Lâm",
      addressLocality: "Ý Yên",
      addressRegion: "Nam Định",
      postalCode: "07000",
      addressCountry: "VN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 20.3789,
      longitude: 106.0124,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "08:00",
        closes: "21:00",
      },
    ],
    sameAs: [
      "https://facebook.com/dodonglocnam",
      "https://youtube.com/@xuongducdonglocnamyyennamdinh",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
