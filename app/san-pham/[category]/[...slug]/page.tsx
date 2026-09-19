import React from "react";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import { unstable_cache } from "next/cache";
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
  DEFAULT_HIERARCHICAL_CATEGORIES,
} from "@/lib/subcategories-data";

interface SlugPageProps {
  params: {
    category: string;
    slug: string[];
  };
}

export const revalidate = 3600;

const getCachedProduct = unstable_cache(
  async (slug: string) => {
    return prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });
  },
  ["san-pham-product-detail"],
  { revalidate: 3600, tags: ["products"] }
);

const getCachedRelatedProducts = unstable_cache(
  async (categoryId: string, currentProductId: string) => {
    return prisma.product.findMany({
      where: {
        categoryId,
        id: { not: currentProductId },
      },
      take: 4,
      include: { category: true },
    });
  },
  ["san-pham-related-products"],
  { revalidate: 3600, tags: ["products"] }
);

export async function generateStaticParams() {
  const paramsList: { category: string; slug: string[] }[] = [];

  DEFAULT_HIERARCHICAL_CATEGORIES.forEach((cat) => {
    cat.subCategories.forEach((sub) => {
      paramsList.push({ category: cat.slug, slug: [sub.id] });
      paramsList.push({ category: cat.slug, slug: [sub.id, "tat-ca"] });
      if (sub.aliases) {
        sub.aliases.forEach((a) => {
          paramsList.push({ category: cat.slug, slug: [a] });
          paramsList.push({ category: cat.slug, slug: [a, "tat-ca"] });
        });
      }
      if (sub.children) {
        sub.children.forEach((child) => {
          paramsList.push({ category: cat.slug, slug: [sub.id, child.id] });
          if (child.aliases) {
            child.aliases.forEach((ca) => {
              paramsList.push({ category: cat.slug, slug: [sub.id, ca] });
            });
          }
        });
      }
    });
  });

  return paramsList;
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { category: categorySlug, slug: slugs } = params;
  const lastSlug = slugs[slugs.length - 1];
  const firstSlug = slugs[0];
  const secondSlug = slugs[1];

  // 1. Check if it's a detail category or subcategory FIRST
  const mainCat = findMainCategory(categorySlug);
  if (secondSlug === "tat-ca" || secondSlug === "all") {
    const sub = findSubCategory(categorySlug, firstSlug);
    if (sub) {
      return {
        title: `Tất Cả Sản Phẩm ${sub.name} Bằng Đồng Cao Cấp | Đồ Đồng Lộc Nam`,
        description: `Xem toàn bộ sản phẩm ${sub.name} đúc thủ công tinh xảo tại Đồ Đồng Lộc Nam.`,
      };
    }
  }

  if (secondSlug) {
    const detail = findDetailCategory(categorySlug, firstSlug, secondSlug);
    if (detail) {
      return {
        title: `${detail.name} Bằng Đồng Cao Cấp Ý Yên | Đồ Đồng Lộc Nam`,
        description: `Tuyển tập các mẫu ${detail.name} bằng đồng đúc thủ công tinh xảo, chất lượng đỉnh cao, phôi đồng thanh khiết tại Đồ Đồng Lộc Nam.`,
      };
    }
  }

  if (firstSlug && slugs.length === 1) {
    const sub = findSubCategory(categorySlug, firstSlug);
    if (sub) {
      return {
        title: `${sub.name} Bằng Đồng Cao Cấp | Đồ Đồng Lộc Nam`,
        description: `Danh mục ${sub.name} đúc thủ công tinh xảo từ xưởng đúc đồng Lộc Nam Ý Yên Nam Định. Đảm bảo chất lượng, bảo hành dài hạn.`,
      };
    }
  }

  // 2. Check if last slug is a product in DB
  const product = await getCachedProduct(lastSlug);

  if (product) {
    let parsedImages: string[] = [];
    try {
      parsedImages = JSON.parse(product.images);
    } catch {
      parsedImages = [product.images || "/images/hero_golden_ship.jpg"];
    }
    const mainImage = parsedImages[0] || "/images/hero_golden_ship.jpg";

    return {
      title: `${product.name} - Đúc Đồng Thủ Công Tinh Xảo | Đồ Đồng Lộc Nam`,
      description:
        product.shortDescription ||
        `Mua ${product.name} chất lượng cao, đúc thủ công từ phôi đồng nguyên chất tại làng nghề Ý Yên, Nam Định. Bảo hành trọn đời, giao hàng toàn quốc.`,
      openGraph: {
        title: `${product.name} | Đồ Đồng Lộc Nam`,
        description: product.shortDescription || `Chi tiết sản phẩm ${product.name}`,
        images: [{ url: mainImage.startsWith("http") ? mainImage : `https://www.quatanglocnam.com${mainImage}` }],
      },
    };
  }

  return {
    title: "Sản Phẩm Đồ Đồng Cao Cấp | Đồ Đồng Lộc Nam",
  };
}

export default async function CategoryCatchAllPage({ params }: SlugPageProps) {
  const { category: categorySlug, slug: slugs } = params;

  if (categorySlug === "qua-tang-dong" || categorySlug === "qua-tang") {
    redirect(`/qua-tang/${slugs.join("/")}`);
  }

  if (slugs.includes("bo-12-con-giap") || slugs.includes("cac-linh-vat-khac")) {
    redirect("/qua-tang/qua-tang-phong-thuy");
  }

  const firstSlug = slugs[0];
  const secondSlug = slugs[1];
  const lastSlug = slugs[slugs.length - 1];

  const mainCat = findMainCategory(categorySlug);
  const subCategory = firstSlug ? findSubCategory(categorySlug, firstSlug) : undefined;
  const detailCategory = (firstSlug && secondSlug) ? findDetailCategory(categorySlug, firstSlug, secondSlug) : undefined;

  // =========================================================================
  // CASE 1: CATEGORY HIERARCHY NAVIGATION (LEVEL 4 GRID OR LEVEL 5 LISTING)
  // Always check category hierarchy FIRST so subcategories and detail categories
  // never collide with single product slugs.
  // =========================================================================
  if (mainCat && subCategory) {
    // -------------------------------------------------------------------------
    // SUB-CASE 1A: SLUG HAS 1 ITEM AND IT HAS CHILDREN -> LEVEL 4 GRID CARDS
    // (e.g. /san-pham/tuong-dong/tuong-phat -> 11 Buddha statues Grid Cards)
    // -------------------------------------------------------------------------
    if (slugs.length === 1 && subCategory.children && subCategory.children.length > 0) {
      const gridItems = subCategory.children.map((child) => ({
        id: child.id,
        name: child.name,
        image: child.image,
        href: `/san-pham/${categorySlug}/${subCategory.id}/${child.id}`,
      }));

      const breadcrumbs = [
        { name: "Trang chủ", url: "/" },
        { name: "Sản phẩm", url: "/san-pham" },
        { name: mainCat.name, url: `/san-pham/${categorySlug}` },
        { name: subCategory.name },
      ];

      return (
        <div className="min-h-screen flex flex-col justify-between bg-[#070e17] text-white">
          <BreadcrumbJsonLd
            items={[
              { name: "Trang Chủ", url: "https://www.quatanglocnam.com" },
              { name: "Sản Phẩm", url: "https://www.quatanglocnam.com/san-pham" },
              { name: mainCat.name, url: `https://www.quatanglocnam.com/san-pham/${categorySlug}` },
              { name: subCategory.name, url: `https://www.quatanglocnam.com/san-pham/${categorySlug}/${subCategory.id}` },
            ]}
          />

          <ModernHeader />

          <main className="flex-grow">
            <CategorySubGrid
              title={subCategory.name}
              subtitle={`${gridItems.length} DANH MỤC CHI TIẾT`}
              description={`Tuyển tập các mẫu ${subCategory.name.toLowerCase()} đúc thủ công tinh xảo tại xưởng Đồ Đồng Lộc Nam - Ý Yên Nam Định.`}
              items={gridItems}
              breadcrumbs={breadcrumbs}
              parentBackHref={`/san-pham/${categorySlug}`}
              parentBackText={`Trở về danh mục ${mainCat.name}`}
              viewAllHref={`/san-pham/${categorySlug}/${subCategory.id}/tat-ca`}
              viewAllText={`Xem toàn bộ sản phẩm ${subCategory.name} ›`}
            />
          </main>

          <LocNamPartners />
          <ModernFooter />
          <FloatingContact hotline="0836 122 222" hotline2="0846 699 997" zalo="0846699997" />
        </div>
      );
    }

    // -------------------------------------------------------------------------
    // SUB-CASE 1B: SLUG HAS 2 ITEMS AND MATCHES DETAIL CATEGORY OR "tat-ca" -> LEVEL 5 LISTING
    // (e.g. /san-pham/tuong-dong/tuong-danh-nhan/tuong-gia-cat-luong -> Product Listing)
    // -------------------------------------------------------------------------
    if (slugs.length === 2 && (detailCategory || secondSlug === "tat-ca" || secondSlug === "all")) {
      const isCrossCategory =
        categorySlug === "qua-tang" ||
        categorySlug === "qua-tang-dong" ||
        subCategory.id === "linh-vat-12-con-giap" ||
        subCategory.id === "trong-dong-qua-tang";

      const allProducts = await prisma.product.findMany({
        where: isCrossCategory
          ? {
              category: {
                slug: { in: [categorySlug, "tuong-dong", "qua-tang-dong", "trong-dong"] },
              },
            }
          : {
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

      const breadcrumbs = [
        { name: "Trang chủ", url: "/" },
        { name: "Sản phẩm", url: "/san-pham" },
        { name: mainCat.name, url: `/san-pham/${categorySlug}` },
        { name: subCategory.name, url: `/san-pham/${categorySlug}/${subCategory.id}` },
        { name: detailCategory ? detailCategory.name : "Tất cả sản phẩm" },
      ];

      return (
        <div className="min-h-screen flex flex-col justify-between bg-[#070e17] text-white">
          <BreadcrumbJsonLd
            items={[
              { name: "Trang Chủ", url: "https://www.quatanglocnam.com" },
              { name: "Sản Phẩm", url: "https://www.quatanglocnam.com/san-pham" },
              { name: mainCat.name, url: `https://www.quatanglocnam.com/san-pham/${categorySlug}` },
              { name: subCategory.name, url: `https://www.quatanglocnam.com/san-pham/${categorySlug}/${subCategory.id}` },
              ...(detailCategory
                ? [{ name: detailCategory.name, url: `https://www.quatanglocnam.com/san-pham/${categorySlug}/${subCategory.id}/${detailCategory.id}` }]
                : []),
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
              parentBackHref={`/san-pham/${categorySlug}/${subCategory.id}`}
              parentBackText={`Trở về danh mục ${subCategory.name}`}
            />
          </main>

          <LocNamPartners />
          <ModernFooter />
          <FloatingContact hotline="0836 122 222" hotline2="0846 699 997" zalo="0846699997" />
        </div>
      );
    }

    // -------------------------------------------------------------------------
    // SUB-CASE 1C: SLUG HAS 1 ITEM WITH NO CHILDREN -> LEVEL 5 PRODUCT LISTING
    // (e.g. /san-pham/tuong-dong/tuong-truyen-than, tuong-than-thanh, tuong-tam-da, tuong-vua)
    // -------------------------------------------------------------------------
    if (slugs.length === 1 && (!subCategory.children || subCategory.children.length === 0)) {
      const isCrossCategory =
        categorySlug === "qua-tang" ||
        categorySlug === "qua-tang-dong" ||
        subCategory.id === "linh-vat-12-con-giap" ||
        subCategory.id === "trong-dong-qua-tang";

      const allProducts = await prisma.product.findMany({
        where: isCrossCategory
          ? {
              category: {
                slug: { in: [categorySlug, "tuong-dong", "qua-tang-dong", "trong-dong"] },
              },
            }
          : {
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

      const breadcrumbs = [
        { name: "Trang chủ", url: "/" },
        { name: "Sản phẩm", url: "/san-pham" },
        { name: mainCat.name, url: `/san-pham/${categorySlug}` },
        { name: subCategory.name },
      ];

      return (
        <div className="min-h-screen flex flex-col justify-between bg-[#070e17] text-white">
          <BreadcrumbJsonLd
            items={[
              { name: "Trang Chủ", url: "https://www.quatanglocnam.com" },
              { name: "Sản Phẩm", url: "https://www.quatanglocnam.com/san-pham" },
              { name: mainCat.name, url: `https://www.quatanglocnam.com/san-pham/${categorySlug}` },
              { name: subCategory.name, url: `https://www.quatanglocnam.com/san-pham/${categorySlug}/${subCategory.id}` },
            ]}
          />

          <ModernHeader />

          <main className="flex-grow">
            <CategoryProductListingView
              mainCategory={mainCat}
              activeSubCategory={subCategory}
              products={allProducts}
              breadcrumbs={breadcrumbs}
              parentBackHref={`/san-pham/${categorySlug}`}
              parentBackText={`Trở về danh mục ${mainCat.name}`}
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
  // CASE 2: LAST SLUG IS A PRODUCT DETAIL IN DATABASE
  // =========================================================================
  const product = await getCachedProduct(lastSlug);

  if (product) {
    const relatedProductsData = await getCachedRelatedProducts(product.categoryId, product.id);

    let parsedImages: string[] = [];
    try {
      parsedImages = JSON.parse(product.images);
    } catch {
      parsedImages = [product.images || "/images/hero_golden_ship.jpg"];
    }

    const fullUrl = `https://www.quatanglocnam.com/san-pham/${categorySlug}/${slugs.join("/")}`;

    const relatedProducts = relatedProductsData.map((rel) => {
      let relImages: string[] = [];
      try {
        relImages = JSON.parse(rel.images);
      } catch {
        relImages = [rel.images || "/images/hero_golden_ship.jpg"];
      }
      return {
        id: rel.id,
        name: rel.name,
        slug: rel.slug,
        price: rel.price,
        images: relImages,
        category: { slug: rel.category.slug },
      };
    });

    const productClientData = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      material: product.material,
      dimensions: product.dimensions,
      weight: product.weight,
      shortDescription: product.shortDescription,
      description: product.description,
      images: parsedImages,
      category: {
        name: product.category.name,
        slug: product.category.slug,
      },
    };

    // Breadcrumbs for product
    const catName = mainCat?.name || product.category.name;
    const breadcrumbItems: { name: string; url?: string }[] = [
      { name: "Trang chủ", url: "/" },
      { name: "Sản phẩm", url: "/san-pham" },
      { name: catName, url: `/san-pham/${categorySlug}` },
    ];

    if (slugs.length > 2) {
      const subSlug = slugs[0];
      const detailSlug = slugs[1];
      const sub = findSubCategory(categorySlug, subSlug);
      const detail = findDetailCategory(categorySlug, subSlug, detailSlug);
      if (sub) {
        breadcrumbItems.push({ name: sub.name, url: `/san-pham/${categorySlug}/${subSlug}` });
      }
      if (detail) {
        breadcrumbItems.push({
          name: detail.name,
          url: `/san-pham/${categorySlug}/${subSlug}/${detailSlug}`,
        });
      }
    } else if (slugs.length === 2) {
      const subSlug = slugs[0];
      const sub = findSubCategory(categorySlug, subSlug);
      if (sub) {
        breadcrumbItems.push({ name: sub.name, url: `/san-pham/${categorySlug}/${subSlug}` });
      }
    }

    breadcrumbItems.push({ name: product.name });

    return (
      <div className="min-h-screen flex flex-col justify-between bg-[#070e17] text-[#e2e8f0] antialiased">
        <BreadcrumbJsonLd
          items={breadcrumbItems.map((b) => ({
            name: b.name,
            url: b.url ? `https://www.quatanglocnam.com${b.url}` : fullUrl,
          }))}
        />

        <ProductJsonLd
          name={product.name}
          description={product.shortDescription || product.description || product.name}
          images={parsedImages.map((img) =>
            img.startsWith("http") ? img : `https://www.quatanglocnam.com${img}`
          )}
          price={product.price}
          categoryName={product.category.name}
          url={fullUrl}
          sku={`LOCNAM-${product.slug.toUpperCase()}`}
        />

        <ModernHeader />

        <main className="flex-grow max-w-[1440px] mx-auto px-4 sm:px-6 2xl:px-8 py-4 w-full">
          <ProductDetailClient
            product={productClientData}
            relatedProducts={relatedProducts}
            hotline1="0836 122 222"
            hotline2="0846 699 997"
            cleanPhone1="0836122222"
            cleanPhone2="0846699997"
            zaloPhone="0846699997"
            fullUrl={fullUrl}
          />
        </main>

        <LocNamPartners />
        <ModernFooter />
        <FloatingContact hotline="0836 122 222" hotline2="0846 699 997" zalo="0846699997" />
      </div>
    );
  }

  notFound();
}
