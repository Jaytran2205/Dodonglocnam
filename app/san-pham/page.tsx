import { LocNamPartners } from "@/components/home/LocNamPartners";
import React from "react";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { ModernHeader } from "@/components/common/ModernHeader";
import { ModernFooter } from "@/components/common/ModernFooter";
import { LeGiaProductListing } from "@/components/product/LeGiaProductListing";
import { FloatingContact } from "@/components/common/FloatingContact";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { CategorySeoContent } from "@/components/product/CategorySeoContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tất Cả Sản Phẩm Đồ Đồng Cao Cấp Ý Yên Nam Định | Đồ Đồng Lộc Nam",
  description:
    "Tổng hợp các dòng sản phẩm đồ đồng thủ công mỹ nghệ cao cấp Lộc Nam: đồ thờ cúng gia tiên, tượng đồng phong thủy, quà tặng mạ vàng 24k, mô hình thuyền buồm, trống đồng Đông Sơn đúc thủ công Ý Yên Nam Định.",
  keywords: [
    "tất cả sản phẩm đồ đồng",
    "đồ đồng nam định",
    "đồ đồng đẹp",
    "đồ đồng lộc nam",
    "đồ thờ cúng bằng đồng",
    "tượng đồng phong thủy",
    "quà tặng mạ vàng 24k",
    "trống đồng đông sơn",
    "đúc đồng ý yên",
  ].join(", "),
  alternates: {
    canonical: "https://www.quatanglocnam.com/san-pham",
  },
  openGraph: {
    title: "Tất Cả Sản Phẩm Đồ Đồng Cao Cấp | Đồ Đồng Lộc Nam",
    description:
      "Tuyển tập kiệt tác đồ đồng mỹ nghệ thủ công tinh xảo của xưởng Đồ Đồng Lộc Nam - Nam Định. Đồng chuẩn 100%, bảo hành trọn đời.",
    url: "https://www.quatanglocnam.com/san-pham",
    siteName: "Đồ Đồng Lộc Nam",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/images/hero_golden_ship.jpg",
        width: 1200,
        height: 630,
        alt: "Sản phẩm Đồ Đồng Lộc Nam",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tất Cả Sản Phẩm Đồ Đồng Cao Cấp | Đồ Đồng Lộc Nam",
    description:
      "Tuyển tập kiệt tác đồ đồng mỹ nghệ thủ công tinh xảo của xưởng Đồ Đồng Lộc Nam - Nam Định.",
  },
};

interface AllProductsPageProps {
  searchParams?: {
    sub?: string;
    category?: string;
  };
}

export default async function AllProductsPage({ searchParams }: AllProductsPageProps) {
  const initialSub = searchParams?.sub;
  const initialCategory = searchParams?.category;

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: {
        select: { name: true, slug: true },
      },
    },
  });

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#070e17] text-white">
      {/* Breadcrumb Schema for Google SERP */}
      <BreadcrumbJsonLd
        items={[
          { name: "Trang Chủ", url: "https://www.quatanglocnam.com" },
          { name: "Sản Phẩm", url: "https://www.quatanglocnam.com/san-pham" },
        ]}
      />

      <ModernHeader />

      <main className="flex-grow">
        <LeGiaProductListing
          products={products}
          categories={categories}
          currentCategorySlug={initialCategory}
          initialSub={initialSub}
          pageTitle="TẤT CẢ SẢN PHẨM"
        />

        <div className="max-w-[1720px] 2xl:max-w-[1820px] mx-auto px-4 sm:px-8 pb-12">
          <CategorySeoContent categorySlug="all" />
        </div>
      </main>

      <LocNamPartners />
      <ModernFooter />
      <FloatingContact hotline="0846 699 997" zalo="0846699997" />
    </div>
  );
}
