import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { getCatalog } from "@/lib/catalog";
import { getSubCatInfoForProduct } from "@/lib/subcategories-data";
import { parseImageList } from "@/lib/utils";
import {
  filterAdminProducts,
  AdminProductFilters,
} from "@/lib/admin-product-filter";
import { getAdminCategoryOptions } from "@/lib/admin-category-options";

// Compact search index stays on the server. Images/editor content are not part
// of the index and no full product list is sent to the browser.
const getIndex = unstable_cache(
  async () => {
    const [rows, catalog, categories] = await Promise.all([
      prisma.product.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          inStock: true,
          material: true,
          tags: true,
          categoryId: true,
          categoryIds: true,
          subCategoryId: true,
          subCategoryIds: true,
          createdAt: true,
          category: { select: { id: true, name: true, slug: true } },
        },
      }),
      getCatalog(),
      getAdminCategoryOptions(),
    ]);
    return {
      catalog,
      categories,
      rows: rows.map((row) => ({
        ...row,
        _subInfo: getSubCatInfoForProduct(row, catalog),
      })),
    };
  },
  ["admin-product-search-index-v1"],
  { revalidate: 60, tags: ["products", "catalog", "categories"] }
);

export async function pagedAdminProducts(params: URLSearchParams) {
  const filters: AdminProductFilters = {
    search: params.get("search") || "",
    selectedCat: params.get("categoryId") || "ALL",
    selectedSubCat: params.get("subCategoryId") || "ALL",
    stockFilter: params.get("stock") || "ALL",
    sortBy: params.get("sort") || "newest",
  };
  const limit = Math.min(
    100,
    Math.max(1, Number.parseInt(params.get("limit") || "40", 10) || 40)
  );
  const requestedPage = Math.max(
    1,
    Number.parseInt(params.get("page") || "1", 10) || 1
  );
  // The first/default view must not wait for a catalogue/search-index refresh.
  // Count, page clamp, category join and rows all come back in one SQL round trip.
  if (
    !filters.search.trim() &&
    filters.selectedCat === "ALL" &&
    filters.selectedSubCat === "ALL" &&
    filters.stockFilter === "ALL" &&
    filters.sortBy === "newest"
  ) {
    const [result] = await prisma.$queryRaw<
      { total: number; products: any[] }[]
    >`
      WITH totals AS (SELECT COUNT(*)::int AS total FROM "Product"),
      page_rows AS (
        SELECT p.id, p.name, p.slug, p.price, p."originalPrice", p.images, p."isFeatured", p."inStock",
          p."categoryId", p."categoryIds", p."subCategoryId", p."subCategoryIds", p.tags, p."createdAt",
          jsonb_build_object('id', c.id, 'name', c.name, 'slug', c.slug) AS category
        FROM "Product" p LEFT JOIN "Category" c ON c.id = p."categoryId"
        ORDER BY p."createdAt" DESC, p.id ASC LIMIT ${limit}
        OFFSET (SELECT LEAST(${requestedPage} - 1, GREATEST(CEIL(total::numeric / ${limit}) - 1, 0))::int * ${limit} FROM totals)
      )
      SELECT t.total, COALESCE(jsonb_agg(to_jsonb(p) ORDER BY p."createdAt" DESC, p.id ASC)
        FILTER (WHERE p.id IS NOT NULL), '[]'::jsonb) AS products
      FROM totals t LEFT JOIN page_rows p ON true GROUP BY t.total
    `;
    const total = result?.total || 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    return {
      success: true,
      products: (result?.products || []).map((row) => ({
        ...row,
        images: JSON.stringify(parseImageList(row.images).slice(0, 1)),
      })),
      totalProducts: total,
      pagination: {
        total,
        page: Math.min(requestedPage, totalPages),
        limit,
        totalPages,
      },
    };
  }
  const { rows, catalog, categories } = await getIndex();
  const filtered = filterAdminProducts(rows, catalog, categories, filters);
  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const page = Math.min(totalPages, requestedPage);
  const selected = filtered.slice((page - 1) * limit, page * limit);
  const records = selected.length
    ? await prisma.product.findMany({
        where: { id: { in: selected.map((row) => row.id) } },
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          originalPrice: true,
          images: true,
          isFeatured: true,
          inStock: true,
          categoryId: true,
          categoryIds: true,
          subCategoryId: true,
          subCategoryIds: true,
          tags: true,
          createdAt: true,
          category: { select: { id: true, name: true, slug: true } },
        },
        take: limit,
      })
    : [];
  const byId = new Map(records.map((record) => [record.id, record]));
  const products = selected.flatMap((row) => {
    const record = byId.get(row.id);
    return record
      ? [
          {
            ...record,
            images: JSON.stringify(parseImageList(record.images).slice(0, 1)),
            subcategoryLabel: row._subInfo?.name || null,
          },
        ]
      : [];
  });
  return {
    success: true,
    products,
    totalProducts: rows.length,
    pagination: { total: filtered.length, page, limit, totalPages },
  };
}
