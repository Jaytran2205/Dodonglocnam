import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";

const getIndex = unstable_cache(
  () =>
    prisma.article.findMany({
      select: {
        id: true,
        title: true,
        summary: true,
        category: true,
        isPublished: true,
        publishedAt: true,
      },
      orderBy: [{ publishedAt: "desc" }, { id: "asc" }],
    }),
  ["admin-article-search-index-v1"],
  { revalidate: 60, tags: ["articles"] }
);

export async function pagedAdminArticles(
  params: URLSearchParams,
  authenticated: boolean
) {
  const index = await getIndex();
  const visible = authenticated
    ? index
    : index.filter((article) => article.isPublished);
  const query = (params.get("search") || "").trim().toLowerCase();
  const category = params.get("category") || "ALL";
  const filtered = visible.filter(
    (article) =>
      (category === "ALL" || article.category === category) &&
      (!query ||
        [article.title, article.summary || "", article.category].some((value) =>
          value.toLowerCase().includes(query)
        ))
  );
  const limit = Math.min(
    100,
    Math.max(1, Number.parseInt(params.get("limit") || "40", 10) || 40)
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const page = Math.min(
    totalPages,
    Math.max(1, Number.parseInt(params.get("page") || "1", 10) || 1)
  );
  const ids = filtered
    .slice((page - 1) * limit, page * limit)
    .map((article) => article.id);
  const records = ids.length
    ? await prisma.article.findMany({
        where: {
          id: { in: ids },
          ...(!authenticated ? { isPublished: true } : {}),
        },
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          summary: true,
          thumbnail: true,
          category: true,
          tags: true,
          isPublished: true,
          viewCount: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
          subCategoryId: true,
          categoryIds: true,
          subCategoryIds: true,
        },
      })
    : [];
  const byId = new Map(records.map((article) => [article.id, article]));
  return {
    success: true,
    articles: ids.flatMap((id) => (byId.has(id) ? [byId.get(id)!] : [])),
    totalArticles: visible.length,
    categories: Array.from(new Set(visible.map((article) => article.category))),
    pagination: { total: filtered.length, page, limit, totalPages },
  };
}
