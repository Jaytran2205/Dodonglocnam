import { parseImageList } from "@/lib/utils";
import { getCatalog } from "@/lib/catalog";
import { SITE_URL, siteUrl } from "@/lib/site";
import React, { cache } from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
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
} from "@/lib/subcategories-data";

interface SlugPageProps {
  params: {
    slug: string[];
  };
}

export const revalidate = 3600;

const getCachedProduct = cache(
  unstable_cache(
    async (slug: string) => {
      return prisma.product.findUnique({
        where: { slug },
        include: { category: true },
      });
    },
    ["qua-tang-product-detail"],
    { revalidate: 3600, tags: ["products"] }
  )
);

const getCachedRelatedProducts = cache(
  unstable_cache(
    async (categoryId: string, currentProductId: string) => {
      return prisma.product.findMany({
        where: {
          categoryId,
          id: { not: currentProductId },
        },
        take: 4,
        include: {
          category: {
            select: { name: true, slug: true },
          },
        },
      });
    },
    ["qua-tang-related-products"],
    { revalidate: 3600, tags: ["products"] }
  )
);

const getCachedAllGiftProducts = cache(
  unstable_cache(
    async () => {
      return prisma.product.findMany({
        where: {
          OR: [
            { category: { slug: { in: ["qua-tang", "qua-tang-dong"] } } },
            { categoryIds: { contains: "qua-tang" } },
            { tags: { contains: "quà tặng" } },
          ],
        },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          originalPrice: true,
          images: true,
          subCategoryId: true,
          subCategoryIds: true,
          categoryIds: true,
          tags: true,
          category: {
            select: { name: true, slug: true },
          },
        },
      });
    },
    ["qua-tang-all-category-products"],
    { revalidate: 3600, tags: ["products"] }
  )
);

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const catalog = await getCatalog();
  const { slug: slugs } = params;
  const lastSlug = slugs[slugs.length - 1];
  const firstSlug = slugs[0];
  const secondSlug = slugs[1];
  let canonicalPath = `/qua-tang/${slugs.join("/")}`;
  const canonicalMain = findMainCategory("qua-tang", catalog);
  const canonicalSub = canonicalMain && findSubCategory(canonicalMain.slug, firstSlug, catalog);
  const canonicalDetail = canonicalSub && findDetailCategory(canonicalMain!.slug, canonicalSub.id, secondSlug, catalog);
  if (canonicalSub) {
    const prefix = canonicalMain!.slug === "qua-tang" ? "/qua-tang" : `/san-pham/${canonicalMain!.slug}`;
    canonicalPath = `${prefix}/${canonicalSub.id}${canonicalDetail ? `/${canonicalDetail.id}` : secondSlug === "all" || secondSlug === "tat-ca" ? "/tat-ca" : ""}`;
  }

  const mainCat = findMainCategory("qua-tang", catalog);

  if (secondSlug === "tat-ca" || secondSlug === "all") {
    const sub = findSubCategory("qua-tang", firstSlug, catalog);
    if (sub) {
      return {
        alternates: { canonical: siteUrl(canonicalPath) },
        title: `Tất Cả Sản Phẩm ${sub.name} Mạ Vàng 24K | Đồ Đồng Lộc Nam`,
        description: `Xem toàn bộ danh mục sản phẩm ${sub.name} đúc thủ công tinh xảo, mạ vàng 24k cao cấp tại Đồ Đồng Lộc Nam.`,
      };
    }
  }

  if (secondSlug) {
    const detail = findDetailCategory("qua-tang", firstSlug, secondSlug, catalog);
    if (detail) {
      return {
        alternates: { canonical: siteUrl(canonicalPath) },
        title: `${detail.name} Bằng Đồng Mạ Vàng Cao Cấp | Đồ Đồng Lộc Nam`,
        description: `Tuyển tập các mẫu ${detail.name} bằng đồng mạ vàng 24k đúc thủ công tinh xảo, chất lượng đỉnh cao, phôi đồng thanh khiết tại Đồ Đồng Lộc Nam.`,
      };
    }
  }

  if (firstSlug && slugs.length === 1) {
    const sub = findSubCategory("qua-tang", firstSlug, catalog);
    if (sub) {
      return {
        alternates: { canonical: siteUrl(canonicalPath) },
        title: `${sub.name} Bằng Đồng Mạ Vàng Cao Cấp | Đồ Đồng Lộc Nam`,
        description: `Danh mục ${sub.name} đúc thủ công tinh xảo từ xưởng đúc đồng Lộc Nam Ý Yên Nam Định. Đảm bảo chất lượng, bảo hành dài hạn.`,
      };
    }
  }

  const product = await getCachedProduct(lastSlug);

  if (product) {
    canonicalPath = `/san-pham/${product.slug}`;
    const parsedImages = parseImageList(product.images);
    const mainImage = parsedImages[0] || "/images/hero_golden_ship.jpg";

    return {
        alternates: { canonical: siteUrl(canonicalPath) },
      title: `${product.name} - Quà Tặng Mạ Vàng Cao Cấp | Đồ Đồng Lộc Nam`,
      description:
        product.shortDescription ||
        `Mua ${product.name} chất lượng cao, đúc thủ công từ phôi đồng nguyên chất tại làng nghề Ý Yên, Nam Định.`,
      openGraph: {
        title: `${product.name} | Đồ Đồng Lộc Nam`,
        description: product.shortDescription || `Chi tiết sản phẩm ${product.name}`,
        images: [{ url: mainImage.startsWith("http") ? mainImage : `${SITE_URL}${mainImage}` }],
      },
    };
  }

  return {
        alternates: { canonical: siteUrl(canonicalPath) },
    title: "Quà Tặng Bằng Đồng Cao Cấp | Đồ Đồng Lộc Nam",
  };
}

export default async function QuaTangCatchAllPage({ params }: SlugPageProps) {
  const catalog = await getCatalog();
  const { slug: slugs } = params;
  const firstSlug = slugs[0];
  const secondSlug = slugs[1];
  const lastSlug = slugs[slugs.length - 1];

  const mainCat = findMainCategory("qua-tang", catalog);
  const subCategory = firstSlug ? findSubCategory("qua-tang", firstSlug, catalog) : undefined;
  const isSecondSlugSubAlias =
    Boolean(secondSlug &&
    subCategory &&
    (secondSlug === "tat-ca" ||
      secondSlug === "all" ||
      secondSlug === firstSlug ||
      secondSlug === subCategory.id ||
      (subCategory.aliases && subCategory.aliases.includes(secondSlug))));

  const detailCategory =
    firstSlug && secondSlug && !isSecondSlugSubAlias
      ? findDetailCategory("qua-tang", firstSlug, secondSlug, catalog)
      : undefined;

  // =========================================================================
  // CASE 1: CATEGORY HIERARCHY NAVIGATION (LEVEL 3 SUB & LEVEL 4 DETAIL LISTING)
  // =========================================================================
  if (mainCat && subCategory) {
    if (slugs.length === 1 || (slugs.length === 2 && (detailCategory || isSecondSlugSubAlias))) {
      const allProducts = await getCachedAllGiftProducts();

      const breadcrumbs = [
        { name: "Trang chủ", url: "/" },
        { name: "Quà tặng", url: "/qua-tang" },
        { name: subCategory.name, url: `/qua-tang/${subCategory.id}` },
        ...(detailCategory ? [{ name: detailCategory.name }] : []),
      ];

      return (
        <div className="min-h-screen flex flex-col justify-between bg-[#070e17] text-white">
          <BreadcrumbJsonLd
            items={[
              { name: "Trang Chủ", url: SITE_URL },
              { name: "Quà Tặng", url: siteUrl('/qua-tang') },
              { name: subCategory.name, url: `${SITE_URL}/qua-tang/${subCategory.id}` },
              ...(detailCategory
                ? [{ name: detailCategory.name, url: `${SITE_URL}/qua-tang/${subCategory.id}/${detailCategory.id}` }]
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
  }

  // =========================================================================
  // CASE 2: SINGLE PRODUCT DETAIL PAGE
  // =========================================================================
  const product = await getCachedProduct(lastSlug);

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
    const relatedProductsData = await getCachedRelatedProducts(product.categoryId, product.id);

    const relatedProducts = relatedProductsData.map((rel) => {
      const relImages = parseImageList(rel.images);
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
      images: images,
      category: {
        name: product.category.name,
        slug: product.category.slug,
      },
    };

    const fullUrl = `${SITE_URL}/qua-tang/${slugs.join("/")}`;

    return (
      <div className="min-h-screen flex flex-col justify-between bg-[#070e17] text-[#e2e8f0] antialiased">
        <ProductJsonLd
          name={product.name}
          description={product.shortDescription || `${product.name} đúc thủ công tại Đồ Đồng Lộc Nam`}
          images={images.map((img) => (img.startsWith("http") ? img : `${SITE_URL}${img}`))}
          sku={`LOCNAM-${product.slug.toUpperCase()}`}
          price={product.price}
          inStock={product.inStock}
          categoryName={product.category?.name || "Quà Tặng"}
          url={fullUrl}
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

  // Not found in categories nor products
  notFound();
}
