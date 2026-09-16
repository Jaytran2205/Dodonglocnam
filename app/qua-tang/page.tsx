import React from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ModernHeader } from "@/components/common/ModernHeader";
import { ModernFooter } from "@/components/common/ModernFooter";
import { FloatingContact } from "@/components/common/FloatingContact";
import { LocNamPartners } from "@/components/home/LocNamPartners";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { CategorySubGrid } from "@/components/product/CategorySubGrid";
import { findMainCategory } from "@/lib/subcategories-data";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const mainCatData = findMainCategory("qua-tang");
  const title = "Quà Tặng Mạ Vàng 24K, Quà Tặng Doanh Nghiệp & Phong Thủy | Đồ Đồng Lộc Nam";
  const description =
    "Tổng hợp các mẫu quà tặng bằng đồng mạ vàng 24k cao cấp: quà tặng doanh nghiệp, đối tác, sự kiện đại lễ, quà mừng tân gia, mừng thọ và vật phẩm phong thủy chiêu tài Đồ Đồng Lộc Nam.";

  return {
    title,
    description,
    keywords: [
      "quà tặng bằng đồng",
      "quà tặng mạ vàng 24k",
      "quà tặng doanh nghiệp",
      "quà tặng đối tác",
      "quà tặng sự kiện",
      "quà tặng phong thủy",
      "quà tặng lộc nam",
    ].join(", "),
    alternates: {
      canonical: "https://www.quatanglocnam.com/qua-tang",
    },
    openGraph: {
      title,
      description,
      url: "https://www.quatanglocnam.com/qua-tang",
      siteName: "Đồ Đồng Lộc Nam",
      locale: "vi_VN",
      type: "website",
      images: [
        {
          url: mainCatData?.banner || "/images/collections/cat_qua_tang.jpg",
          width: 1200,
          height: 630,
          alt: "Quà tặng bằng đồng cao cấp Lộc Nam",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function QuaTangPage() {
  const mainCategoryData = findMainCategory("qua-tang");

  if (!mainCategoryData) {
    notFound();
  }

  const catName = "Quà Tặng";
  const catBanner = mainCategoryData.banner || "/images/collections/cat_qua_tang.jpg";
  const catDesc = undefined;

  const breadcrumbs = [
    { name: "Trang chủ", url: "/" },
    { name: "Quà tặng", url: "/qua-tang" },
  ];

  const gridItems = mainCategoryData.subCategories.map((sub) => ({
    id: sub.id,
    name: sub.name,
    image: sub.image,
    href: `/qua-tang/${sub.id}`,
  }));

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#070e17] text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Trang Chủ", url: "https://www.quatanglocnam.com" },
          { name: "Quà Tặng", url: "https://www.quatanglocnam.com/qua-tang" },
        ]}
      />

      <ModernHeader />

      <main className="flex-grow">
        <CategorySubGrid
          title={catName}
          subtitle={`${gridItems.length} DANH MỤC CHÍNH`}
          description={catDesc}
          banner={catBanner}
          items={gridItems}
          breadcrumbs={breadcrumbs}
        />
      </main>

      <LocNamPartners />
      <ModernFooter />
      <FloatingContact hotline="0836 122 222" hotline2="0846 699 997" zalo="0846699997" />
    </div>
  );
}
