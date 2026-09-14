import React from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ModernHeader } from "@/components/common/ModernHeader";
import { ModernFooter } from "@/components/common/ModernFooter";
import { FloatingContact } from "@/components/common/FloatingContact";
import { LocNamPartners } from "@/components/home/LocNamPartners";
import { BreadcrumbJsonLd, ProductJsonLd } from "@/components/seo/JsonLd";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { CategorySubGrid } from "@/components/product/CategorySubGrid";
import { CategoryProductListingView } from "@/components/product/CategoryProductListingView";
import {
  findMainCategory,
  findSubCategory,
  findDetailCategory,
} from "@/lib/subcategories-data";

interface SlugPageProps {
  params: {
    slug: string[];
  };
}

export const revalidate = 60;

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug: slugs } = params;
  const lastSlug = slugs[slugs.length - 1];
  const firstSlug = slugs[0];
  const secondSlug = slugs[1];

  const mainCat = findMainCategory("qua-tang");

  if (secondSlug) {
    const detail = findDetailCategory("qua-tang", firstSlug, secondSlug);
    if (detail) {
      return {
        title: `${detail.name} Bằng Đồng Mạ Vàng Cao Cấp | Đồ Đồng Lộc Nam`,
        description: `Tuyển tập các mẫu ${detail.name} bằng đồng mạ vàng 24k đúc thủ công tinh xảo, chất lượng đỉnh cao, phôi đồng thanh khiết tại Đồ Đồng Lộc Nam.`,
      };
    }
  }

  if (firstSlug && slugs.length === 1) {
    const sub = findSubCategory("qua-tang", firstSlug);
    if (sub) {
      return {
        title: `${sub.name} Bằng Đồng Mạ Vàng Cao Cấp | Đồ Đồng Lộc Nam`,
        description: `Danh mục ${sub.name} đúc thủ công tinh xảo từ xưởng đúc đồng Lộc Nam Ý Yên Nam Định. Đảm bảo chất lượng, bảo hành dài hạn.`,
      };
    }
  }

  const product = await prisma.product.findUnique({
    where: { slug: lastSlug },
    include: { category: true },
  });

  if (product) {
    let parsedImages: string[] = [];
    try {
      parsedImages = JSON.parse(product.images);
    } catch {
      parsedImages = [product.images || "/images/hero_golden_ship.jpg"];
    }
    const mainImage = parsedImages[0] || "/images/hero_golden_ship.jpg";

    return {
      title: `${product.name} - Quà Tặng Mạ Vàng Cao Cấp | Đồ Đồng Lộc Nam`,
      description:
        product.shortDescription ||
        `Mua ${product.name} chất lượng cao, đúc thủ công từ phôi đồng nguyên chất tại làng nghề Ý Yên, Nam Định.`,
      openGraph: {
        title: `${product.name} | Đồ Đồng Lộc Nam`,
        description: product.shortDescription || `Chi tiết sản phẩm ${product.name}`,
        images: [{ url: mainImage.startsWith("http") ? mainImage : `https://www.quatanglocnam.com${mainImage}` }],
      },
    };
  }

  return {
    title: "Quà Tặng Bằng Đồng Cao Cấp | Đồ Đồng Lộc Nam",
  };
}

export default async function QuaTangCatchAllPage({ params }: SlugPageProps) {
  const { slug: slugs } = params;
  const firstSlug = slugs[0];
  const secondSlug = slugs[1];
  const lastSlug = slugs[slugs.length - 1];

  const mainCat = findMainCategory("qua-tang");
  const subCategory = firstSlug ? findSubCategory("qua-tang", firstSlug) : undefined;
  const detailCategory = (firstSlug && secondSlug) ? findDetailCategory("qua-tang", firstSlug, secondSlug) : undefined;

  // =========================================================================
  // CASE 1: CATEGORY HIERARCHY NAVIGATION
  // =========================================================================
  if (mainCat && subCategory) {
    // -------------------------------------------------------------------------
    // SUB-CASE 1A: SLUG HAS 1 ITEM AND IT HAS CHILDREN -> LEVEL 3 GRID CARDS
    // (e.g. /qua-tang/qua-tang-doi-tuong -> 6 cards, /qua-tang/qua-tang-su-kien -> 9 cards)
    // -------------------------------------------------------------------------
    if (slugs.length === 1 && subCategory.children && subCategory.children.length > 0) {
      const gridItems = subCategory.children.map((child) => ({
        id: child.id,
        name: child.name,
        image: child.image,
        href: `/qua-tang/${subCategory.id}/${child.id}`,
      }));

      const breadcrumbs = [
        { name: "Trang chủ", url: "/" },
        { name: "Quà tặng", url: "/qua-tang" },
        { name: subCategory.name },
      ];

      return (
        <div className="min-h-screen flex flex-col justify-between bg-[#070e17] text-white">
          <BreadcrumbJsonLd
            items={[
              { name: "Trang Chủ", url: "https://www.quatanglocnam.com" },
              { name: "Quà Tặng", url: "https://www.quatanglocnam.com/qua-tang" },
              { name: subCategory.name, url: `https://www.quatanglocnam.com/qua-tang/${subCategory.id}` },
            ]}
          />

          <ModernHeader />

          <main className="flex-grow">
            <CategorySubGrid
              title={subCategory.name}
              subtitle={`${gridItems.length} DANH MỤC CHI TIẾT`}
              description={`Tuyển tập các mẫu ${subCategory.name.toLowerCase()} đúc thủ công tinh xảo, mạ vàng 24k sang trọng tại xưởng Đồ Đồng Lộc Nam.`}
              items={gridItems}
              breadcrumbs={breadcrumbs}
              parentBackHref="/qua-tang"
              parentBackText="Trở về danh mục Quà tặng"
            />
          </main>

          <LocNamPartners />
          <ModernFooter />
          <FloatingContact hotline="0836 122 222" hotline2="0846 699 997" zalo="0846699997" />
        </div>
      );
    }

    // -------------------------------------------------------------------------
    // SUB-CASE 1B: SLUG HAS 2 ITEMS AND MATCHES DETAIL CATEGORY -> PRODUCT LISTING
    // (e.g. /qua-tang/qua-tang-doi-tuong/qua-tang-doanh-nghiep)
    // -------------------------------------------------------------------------
    if (slugs.length === 2 && detailCategory) {
      const allProducts = await prisma.product.findMany({
        where: {
          category: {
            slug: { in: ["qua-tang", "qua-tang-dong", "tuong-dong", "trong-dong"] },
          },
        },
        orderBy: { createdAt: "desc" },
        include: {
          category: {
            select: { name: true, slug: true },
          },
        },
      });

      const breadcrumbs = [
        { name: "Trang chủ", url: "/" },
        { name: "Quà tặng", url: "/qua-tang" },
        { name: subCategory.name, url: `/qua-tang/${subCategory.id}` },
        { name: detailCategory.name },
      ];

      return (
        <div className="min-h-screen flex flex-col justify-between bg-[#070e17] text-white">
          <BreadcrumbJsonLd
            items={[
              { name: "Trang Chủ", url: "https://www.quatanglocnam.com" },
              { name: "Quà Tặng", url: "https://www.quatanglocnam.com/qua-tang" },
              { name: subCategory.name, url: `https://www.quatanglocnam.com/qua-tang/${subCategory.id}` },
              { name: detailCategory.name, url: `https://www.quatanglocnam.com/qua-tang/${subCategory.id}/${detailCategory.id}` },
            ]}
          />

          <ModernHeader />

          <main className="flex-grow">
            <CategoryProductListingView
              mainCategory={mainCat}
              activeSubCategory={subCategory}
              activeDetailCategory={detailCategory}
              products={allProducts}
              breadcrumbs={breadcrumbs}
              parentBackHref={`/qua-tang/${subCategory.id}`}
              parentBackText={`Trở về danh mục ${subCategory.name}`}
            />
          </main>

          <LocNamPartners />
          <ModernFooter />
          <FloatingContact hotline="0836 122 222" hotline2="0846 699 997" zalo="0846699997" />
        </div>
      );
    }
  }

  // =========================================================================
  // CASE 2: SINGLE PRODUCT DETAIL PAGE
  // =========================================================================
  const product = await prisma.product.findUnique({
    where: { slug: lastSlug },
    include: {
      category: {
        select: { name: true, slug: true },
      },
    },
  });

  if (product) {
    let images: string[] = [];
    try {
      images = JSON.parse(product.images);
    } catch {
      images = [product.images || "/images/hero_golden_ship.jpg"];
    }
    if (images.length === 0) {
      images = ["/images/hero_golden_ship.jpg"];
    }

    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      take: 4,
      include: {
        category: {
          select: { name: true, slug: true },
        },
      },
    });

    const breadcrumbs = [
      { name: "Trang chủ", url: "/" },
      { name: "Quà tặng", url: "/qua-tang" },
      ...(subCategory ? [{ name: subCategory.name, url: `/qua-tang/${subCategory.id}` }] : []),
      { name: product.name },
    ];

    return (
      <div className="min-h-screen flex flex-col justify-between bg-[#070e17] text-white">
        <ProductJsonLd
          product={{
            name: product.name,
            description: product.shortDescription || `${product.name} đúc thủ công tại Đồ Đồng Lộc Nam`,
            images: images.map((img) => img.startsWith("http") ? img : `https://www.quatanglocnam.com${img}`),
            sku: product.sku || product.slug,
            price: product.price ? product.price.toString() : "0",
            category: product.category?.name || "Quà Tặng",
            url: `https://www.quatanglocnam.com/qua-tang/${slugs.join("/")}`,
          }}
        />

        <ModernHeader />

        <main className="flex-grow">
          <ProductDetailClient
            product={product}
            images={images}
            relatedProducts={relatedProducts}
            breadcrumbs={breadcrumbs}
          />
        </main>

        <LocNamPartners />
        <ModernFooter />
        <FloatingContact hotline="0836 122 222" hotline2="0846 699 997" zalo="0846699997" />
      </div>
    );
  }

  // Not found in categories nor products
  notFound();
}
