import React from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ModernHeader } from "@/components/common/ModernHeader";
import { ModernFooter } from "@/components/common/ModernFooter";
import { FloatingContact } from "@/components/common/FloatingContact";
import { LocNamPartners } from "@/components/home/LocNamPartners";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { CategorySeoContent } from "@/components/product/CategorySeoContent";
import { CategorySubGrid } from "@/components/product/CategorySubGrid";
import { CategoryProductListingView } from "@/components/product/CategoryProductListingView";
import { findMainCategory, DEFAULT_HIERARCHICAL_CATEGORIES } from "@/lib/subcategories-data";

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const mainCategories = DEFAULT_HIERARCHICAL_CATEGORIES.map((c) => ({
    category: c.slug,
  }));
  const extraCategories = [
    { category: "qua-tang-dong" },
    { category: "qua-tang" },
    { category: "cup-golf" },
    { category: "vat-pham-my-nghe" },
    { category: "thi-cong-tu-duong" },
    { category: "duc-chuong-cong-trinh" },
  ];
  return [...mainCategories, ...extraCategories];
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categorySlug = params.category;
  const mainCatData = findMainCategory(categorySlug);
  const category = !mainCatData
    ? await prisma.category.findUnique({
        where: { slug: categorySlug },
      })
    : null;
  const catName = mainCatData?.name || category?.name || "Danh Mục Sản Phẩm";

  const categoryTitles: Record<string, string> = {
    "do-tho-cung": "Đồ Thờ Cúng Bằng Đồng Cao Cấp Ý Yên Nam Định | Đồ Đồng Lộc Nam",
    "tuong-dong": "Tượng Đồng Phong Thủy, Tượng Danh Nhân & Đúc Tượng Chân Dung | Đồ Đồng Lộc Nam",
    "tranh-dong": "Tranh Đồng Mỹ Nghệ, Tranh Mạ Vàng Dát Vàng 24K Phong Thủy | Đồ Đồng Lộc Nam",
    "trong-dong": "Trống Đồng Đông Sơn, Quả Trống Đồng Cỡ Lớn & Mặt Trống Phong Thủy | Đồ Đồng Lộc Nam",
    "qua-tang-dong": "Quà Tặng Mạ Vàng 24K, Quà Tặng Doanh Nghiệp & Phong Thủy | Đồ Đồng Lộc Nam",
    "duc-chuong-cong-trinh": "Trống Đồng Đông Sơn, Đúc Chuông Đồng Đại Hồng Chung Uy Tín | Đồ Đồng Lộc Nam",
  };

  const categoryDescriptions: Record<string, string> = {
    "do-tho-cung": "Tổng hợp các mẫu đồ thờ cúng bằng đồng đẹp, bộ ngũ sự, tam sự, đỉnh đồng khảm ngũ sắc, bát hương, hạc thờ đúc thủ công Ý Yên Nam Định bảo hành trọn đời.",
    "tuong-dong": "Chuyên đúc tượng đồng chân dung truyền thần giống thật 99%, tượng Phật, tượng Bác Hồ, tượng Trần Hưng Đạo, tượng Quan Công đồng catut, mạ vàng 24k.",
    "tranh-dong": "Tuyển tập tranh đồng mạ vàng 24k, tranh đồng phong thủy Thuận Buồm Xuôi Gió, Mã Đáo Thành Công, Vinh Quy Bái Tổ, tranh chữ đồng chế tác thủ công tinh xảo.",
    "trong-dong": "Trống đồng Đông Sơn đúc thủ công tinh xảo, quả trống cỡ lớn, mặt trống đồng treo tường phong thủy ý nghĩa văn hóa nghìn năm Thăng Long.",
    "qua-tang-dong": "Quà tặng cao cấp mạ vàng 24k: mô hình thuyền buồm mạ vàng 'Thuận Buồm Xuôi Gió', quà tặng doanh nghiệp, quà tặng sếp, tân gia và phong thủy đẳng cấp.",
    "duc-chuong-cong-trinh": "Xưởng đúc chuông đồng đại hồng chung nhà chùa, phục dựng trống đồng Đông Sơn, đúc tượng đài công trình chất lượng đỉnh cao từ làng nghề Nam Định.",
  };

  const title = categoryTitles[categorySlug] || `${catName} Cao Cấp | Đồ Đồng Lộc Nam`;
  const description =
    categoryDescriptions[categorySlug] ||
    mainCatData?.description ||
    `Danh mục ${catName} thủ công tinh xảo tại Đồ Đồng Lộc Nam - Nam Định. Đảm bảo phôi đồng thanh khiết 100%, bảo hành trọn đời.`;

  return {
    title: title,
    description: description,
    keywords: [
      catName.toLowerCase(),
      `${catName.toLowerCase()} nam định`,
      "đồ đồng đẹp",
      "đồ đồng lộc nam",
      "đồ đồng ý yên",
      "đúc đồng thủ công",
      "đồ đồng cao cấp",
    ].join(", "),
    alternates: {
      canonical: `https://www.quatanglocnam.com/san-pham/${categorySlug}`,
    },
    openGraph: {
      title: title,
      description: description,
      url: `https://www.quatanglocnam.com/san-pham/${categorySlug}`,
      siteName: "Đồ Đồng Lộc Nam",
      locale: "vi_VN",
      type: "website",
      images: [
        {
          url: mainCatData?.banner || "/images/hero_golden_ship.jpg",
          width: 1200,
          height: 630,
          alt: catName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categorySlug = params.category;

  const mainCategoryData = findMainCategory(categorySlug);

  // Check if category exists in DB only if not found in static subcategories
  const dbCategory = !mainCategoryData
    ? await prisma.category.findUnique({
        where: { slug: categorySlug },
      })
    : null;

  if (!mainCategoryData && !dbCategory) {
    notFound();
  }

  const catName = mainCategoryData?.name || dbCategory?.name || "Sản Phẩm";
  const catBanner = mainCategoryData?.banner || "/images/hero_golden_ship.jpg";
  const catDesc = mainCategoryData?.description;

  const breadcrumbs = [
    { name: "Trang chủ", url: "/" },
    { name: "Sản phẩm", url: "/san-pham" },
    { name: catName, url: `/san-pham/${categorySlug}` },
  ];

  // LEVEL 3: If this category has subcategories, render GRID CARDS (3 columns)
  if (mainCategoryData && mainCategoryData.subCategories.length > 0) {
    const gridItems = mainCategoryData.subCategories.map((sub) => ({
      id: sub.id,
      name: sub.name,
      image: sub.image,
      href: `/san-pham/${categorySlug}/${sub.id}`,
    }));

    return (
      <div className="min-h-screen flex flex-col justify-between bg-[#070e17] text-white">
        <BreadcrumbJsonLd
          items={[
            { name: "Trang Chủ", url: "https://www.quatanglocnam.com" },
            { name: "Sản Phẩm", url: "https://www.quatanglocnam.com/san-pham" },
            { name: catName, url: `https://www.quatanglocnam.com/san-pham/${categorySlug}` },
          ]}
        />

        <ModernHeader />

        <main className="flex-grow">
          <CategorySubGrid
            title={catName}
            subtitle={`${gridItems.length} DANH MỤC ĐẠI DIỆN`}
            description={catDesc}
            banner={catBanner}
            items={gridItems}
            breadcrumbs={breadcrumbs}
          />

          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 2xl:px-8 pb-12">
            <CategorySeoContent categorySlug={categorySlug} />
          </div>
        </main>

        <LocNamPartners />
        <ModernFooter />
        <FloatingContact hotline="0836 122 222" hotline2="0846 699 997" zalo="0846699997" />
      </div>
    );
  }

  // Fallback if no subcategories: render Level 5 Product Listing
  const products = await prisma.product.findMany({
    where: {
      category: { slug: categorySlug },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      originalPrice: true,
      images: true,
      category: {
        select: { name: true, slug: true },
      },
    },
  });

  const fallbackCategoryData = mainCategoryData || {
    name: catName,
    slug: categorySlug,
    subCategories: [],
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#070e17] text-white">
      <BreadcrumbJsonLd
        items={[
          { name: "Trang Chủ", url: "https://www.quatanglocnam.com" },
          { name: "Sản Phẩm", url: "https://www.quatanglocnam.com/san-pham" },
          { name: catName, url: `https://www.quatanglocnam.com/san-pham/${categorySlug}` },
        ]}
      />

      <ModernHeader />

      <main className="flex-grow">
        <CategoryProductListingView
          mainCategory={fallbackCategoryData}
          products={products}
          breadcrumbs={breadcrumbs}
        />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 2xl:px-8 pb-12">
          <CategorySeoContent categorySlug={categorySlug} />
        </div>
      </main>

      <LocNamPartners />
      <ModernFooter />
      <FloatingContact hotline="0836 122 222" hotline2="0846 699 997" zalo="0846699997" />
    </div>
  );
}
