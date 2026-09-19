import { LocNamPartners } from "@/components/home/LocNamPartners";
import React, { cache, Suspense } from "react";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { ModernHeader } from "@/components/common/ModernHeader";
import { ModernFooter } from "@/components/common/ModernFooter";
import { LeGiaProductListing } from "@/components/product/LeGiaProductListing";
import { FloatingContact } from "@/components/common/FloatingContact";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { CategorySeoContent } from "@/components/product/CategorySeoContent";

export const revalidate = 60;

const getCachedAllProducts = cache(
  unstable_cache(
    async () => {
      try {
        return await prisma.product.findMany({
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            originalPrice: true,
            images: true,
            material: true,
            dimensions: true,
            createdAt: true,
            category: {
              select: { name: true, slug: true },
            },
          },
        });
      } catch (e) {
        console.error("Error fetching all products:", e);
        return [];
      }
    },
    ["all-products-list"],
    { revalidate: 3600, tags: ["products"] }
  )
);

const getCachedCategories = cache(
  unstable_cache(
    async () => {
      try {
        return await prisma.category.findMany({
          orderBy: { order: "asc" },
        });
      } catch (e) {
        console.error("Error fetching categories:", e);
        return [];
      }
    },
    ["all-categories-list"],
    { revalidate: 3600, tags: ["categories"] }
  )
);

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

export default async function AllProductsPage() {
  const [products, categories] = await Promise.all([
    getCachedAllProducts(),
    getCachedCategories(),
  ]);

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
        <Suspense
          fallback={
            <div className="min-h-[500px] flex items-center justify-center bg-[#070e17]">
              <div className="text-[#ffd700] text-sm animate-pulse font-serif">
                Đang tải sản phẩm Đồ Đồng Lộc Nam...
              </div>
            </div>
          }
        >
          <LeGiaProductListing
            products={products}
            categories={categories}
            pageTitle="TẤT CẢ SẢN PHẨM"
          />
        </Suspense>

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
