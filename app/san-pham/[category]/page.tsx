import { parseImageList } from "@/lib/utils";
import { getCatalog } from "@/lib/catalog";
import { SITE_URL, siteUrl, categoryPath } from "@/lib/site";
import React, { cache } from "react";
import prisma from "@/lib/prisma";
import { notFound, redirect, permanentRedirect } from "next/navigation";
import { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { ModernHeader } from "@/components/common/ModernHeader";
import { ModernFooter } from "@/components/common/ModernFooter";
import { FloatingContact } from "@/components/common/FloatingContact";
import { LocNamPartners } from "@/components/home/LocNamPartners";
import { BreadcrumbJsonLd, ProductJsonLd } from "@/components/seo/JsonLd";
import { CategorySeoContent } from "@/components/product/CategorySeoContent";
import { CategorySubGrid } from "@/components/product/CategorySubGrid";
import { CategoryProductListingView } from "@/components/product/CategoryProductListingView";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { findMainCategory, DEFAULT_HIERARCHICAL_CATEGORIES } from "@/lib/subcategories-data";

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export const revalidate = 60;

const getCachedProduct = cache(
  unstable_cache(
    async (slug: string) => {
      return prisma.product.findUnique({
        where: { slug },
        include: { category: true },
      });
    },
    ["san-pham-product-detail-flat"],
    { revalidate: 60, tags: ["products"] }
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
        include: { category: true },
      });
    },
    ["san-pham-related-products-flat"],
    { revalidate: 60, tags: ["products"] }
  )
);

// Render database-backed category/product pages on their first request (ISR),
// rather than freezing a build machine's fallback catalogue into these routes.
export async function generateStaticParams() {
  return [
    { category: "do-tho-cung" },
    { category: "tuong-dong" },
    { category: "tranh-dong" },
    { category: "trong-dong" },
    { category: "qua-tang-dong" },
    { category: "duc-chuong-cong-trinh" },
  ];
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categorySlug = params.category;
  const destination = categoryPath(categorySlug);
  if (destination !== `/san-pham/${categorySlug}`) redirect(destination);
  const catalog = await getCatalog();
  const mainCatData = findMainCategory(categorySlug, catalog);
  const category = !mainCatData
    ? await prisma.category
        .findUnique({
          where: { slug: categorySlug },
        })
        .catch(() => null)
    : null;

  // 1. If it matches a Category
  if (mainCatData || category) {
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

    const title = mainCatData?.seoTitle || (mainCatData ? `${catName} Cao Cấp | Đồ Đồng Lộc Nam` : categoryTitles[categorySlug] || `${catName} Cao Cấp | Đồ Đồng Lộc Nam`);
    const description =
      mainCatData?.description || category?.description ||
      categoryDescriptions[categorySlug] ||
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
        canonical: `${SITE_URL}/san-pham/${categorySlug}`,
      },
      openGraph: {
        title: title,
        description: description,
        url: `${SITE_URL}/san-pham/${categorySlug}`,
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

  // 2. If it is a Product (Flat URL)
  let product = await getCachedProduct(categorySlug);
  if (!product && categorySlug.includes("dai-tuong-dai-tuong")) {
    product = await getCachedProduct(categorySlug.replace(/dai-tuong-dai-tuong/g, "dai-tuong"));
  }
  if (!product && categorySlug === "tuong-cho-bang-dong-doc-dao-duoc-tai-loc-cao-45cm") {
    product = await getCachedProduct("tuong-cho-bang-dong-doc-dao-ruoc-tai-loc-cao-45cm");
  }

  if (product) {
    const parsedImages = parseImageList(product.images);
    const mainImage = parsedImages[0] || "/images/hero_golden_ship.jpg";

    return {
      title: `${product.name} - Đúc Đồng Thủ Công Tinh Xảo | Đồ Đồng Lộc Nam`,
      description:
        product.shortDescription ||
        `Mua ${product.name} chất lượng cao, đúc thủ công từ phôi đồng nguyên chất tại làng nghề Ý Yên, Nam Định. Bảo hành trọn đời, giao hàng toàn quốc.`,
      alternates: {
        canonical: `${SITE_URL}/san-pham/${product.slug}`,
      },
      openGraph: {
        title: `${product.name} | Đồ Đồng Lộc Nam`,
        description: product.shortDescription || `Chi tiết sản phẩm ${product.name}`,
        url: `${SITE_URL}/san-pham/${product.slug}`,
        images: [{ url: mainImage.startsWith("http") ? mainImage : `${SITE_URL}${mainImage}` }],
      },
    };
  }

  return {
    title: "Sản Phẩm Đồ Đồng Cao Cấp | Đồ Đồng Lộc Nam",
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const catalog = await getCatalog();
  const categorySlug = params.category;

  if (categorySlug === "qua-tang-dong" || categorySlug === "qua-tang") {
    redirect("/qua-tang");
  }
  if (categorySlug === "vat-pham-my-nghe") {
    redirect("/qua-tang/qua-tang-phong-thuy");
  }
  if (categorySlug === "cup-golf") {
    redirect("/qua-tang/qua-tang-su-kien/cup");
  }

  const legacyRedirectMap: Record<string, string> = {
    "tuong-chan-dung-bang-dong-dai-tuong-dai-tuong-vo-nguyen-giap-cao-55cm":
      "tuong-chan-dung-bang-dong-dai-tuong-vo-nguyen-giap-cao-55cm",
    "tuong-cho-bang-dong-doc-dao-duoc-tai-loc-cao-45cm":
      "tuong-cho-bang-dong-doc-dao-ruoc-tai-loc-cao-45cm",
    "tuong-ho-gam-oai-phong-bang-dong-dai-33cm-ma-vang":
      "tuong-ho-phong-thuy-bang-dong-gam-oai-phong-dat-vang-24k",
    "tuong-ran-bang-dong-ngam-ngoc":
      "tuong-ran-bang-dong-ngam-ngoc-ma-vang-24k-phong-thuy",
    "ngua-hi-bang-dong-ma-vang-24k-cao-55-cm":
      "tuong-ngua-hi-phong-thuy-bang-dong-ma-vang-24k-cao-55cm",
    "tuong-de-bang-dong-ngam-tien-dat-vang-24k":
      "tuong-de-bang-dong-ngam-tien-dat-vang-24k-phong-thuy",
  };

  if (legacyRedirectMap[categorySlug]) {
    permanentRedirect(`/san-pham/${legacyRedirectMap[categorySlug]}`);
  }

  const mainCategoryData = findMainCategory(categorySlug, catalog);

  // Check if category exists in DB only if not found in static subcategories
  const dbCategory = !mainCategoryData
    ? await prisma.category
        .findUnique({
          where: { slug: categorySlug },
        })
        .catch(() => null)
    : null;

  // =========================================================================
  // CASE 1: MATCHES A MAIN CATEGORY
  // =========================================================================
  if (mainCategoryData || dbCategory) {
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
              { name: "Trang Chủ", url: SITE_URL },
              { name: "Sản Phẩm", url: siteUrl('/san-pham') },
              { name: catName, url: `${SITE_URL}/san-pham/${categorySlug}` },
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
    const products = await prisma.product
      .findMany({
        where: {
          OR: [
            { category: { slug: categorySlug } },
            { categoryIds: { contains: categorySlug } },
            { subCategoryId: { contains: categorySlug } },
            { subCategoryIds: { contains: categorySlug } },
            { tags: { contains: categorySlug } },
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
      })
      .catch(() => []);

    const fallbackCategoryData = mainCategoryData || {
      name: catName,
      slug: categorySlug,
      subCategories: [],
    };

    return (
      <div className="min-h-screen flex flex-col justify-between bg-[#070e17] text-white">
        <BreadcrumbJsonLd
          items={[
            { name: "Trang Chủ", url: SITE_URL },
            { name: "Sản Phẩm", url: siteUrl('/san-pham') },
            { name: catName, url: `${SITE_URL}/san-pham/${categorySlug}` },
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

  // =========================================================================
  // CASE 2: MATCHES A PRODUCT (FLAT PRODUCT URL: /san-pham/[product-slug])
  // =========================================================================
  let product = await getCachedProduct(categorySlug);

  if (!product && categorySlug.includes("dai-tuong-dai-tuong")) {
    const fixedSlug = categorySlug.replace(/dai-tuong-dai-tuong/g, "dai-tuong");
    permanentRedirect(`/san-pham/${fixedSlug}`);
  }

  if (product) {
    const relatedProductsData = await getCachedRelatedProducts(product.categoryId, product.id);

    const parsedImages = parseImageList(product.images);

    const fullUrl = `${SITE_URL}/san-pham/${product.slug}`;

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
      images: parsedImages,
      category: {
        name: product.category.name,
        slug: product.category.slug,
      },
    };

    const breadcrumbItems: { name: string; url?: string }[] = [
      { name: "Trang chủ", url: "/" },
      { name: "Sản phẩm", url: "/san-pham" },
      { name: product.category.name, url: `/san-pham/${product.category.slug}` },
      { name: product.name },
    ];

    return (
      <div className="min-h-screen flex flex-col justify-between bg-[#070e17] text-[#e2e8f0] antialiased">
        <BreadcrumbJsonLd
          items={breadcrumbItems.map((b) => ({
            name: b.name,
            url: b.url ? `${SITE_URL}${b.url}` : fullUrl,
          }))}
        />

        <ProductJsonLd
          name={product.name}
          description={product.shortDescription || product.description || product.name}
          images={parsedImages.map((img) =>
            img.startsWith("http") ? img : `${SITE_URL}${img}`
          )}
          price={product.price}
          inStock={product.inStock}
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
