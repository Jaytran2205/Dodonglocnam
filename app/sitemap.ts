import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { getCatalog } from "@/lib/catalog";
import { categoryPath, productPath, siteUrl, contentDate } from "@/lib/site";
import { articlesData } from "./tin-tuc/articlesData";
import { projectsData } from "@/data/projects";

// Never publish a build-time or partially empty sitemap when the database is unavailable.
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [catalog, categories, products, articles, catalogSetting] = await Promise.all([
    getCatalog(),
    prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.product.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.article.findMany({ select: { slug: true, isPublished: true, updatedAt: true } }),
    prisma.setting.findUnique({ where: { key: "subcategories_catalog" }, select: { updatedAt: true } }),
  ]);
  const routes = new Map<string, MetadataRoute.Sitemap[number]>();
  const add = (path: string, lastModified?: Date) => {
    const url = siteUrl(path);
    routes.set(url, { url, ...(lastModified ? { lastModified } : {}) });
  };
  ["/", "/gioi-thieu", "/san-pham", "/qua-tang", "/du-an", "/tin-tuc",
    "/ki-thuc-do-dong", "/bo-suu-tap", "/video", "/lien-he"].forEach(path => add(path));
  for (const cat of catalog) {
    if (["cup-golf", "vat-pham-my-nghe"].includes(cat.slug)) continue;
    const prefix = categoryPath(cat.slug);
    const db = categories.find(c => c.slug === cat.slug || cat.aliases?.includes(c.slug));
    const lastModified = db && catalogSetting
      ? new Date(Math.max(db.updatedAt.getTime(), catalogSetting.updatedAt.getTime()))
      : db?.updatedAt || catalogSetting?.updatedAt;
    add(prefix, lastModified);
    for (const sub of cat.subCategories) {
      add(`${prefix}/${sub.id}`, catalogSetting?.updatedAt);
      for (const child of sub.children || []) add(`${prefix}/${sub.id}/${child.id}`, catalogSetting?.updatedAt);
    }
  }
  for (const product of products) {
    if (!catalog.some(c => c.slug === product.slug || c.aliases?.includes(product.slug))) add(productPath(product.slug), product.updatedAt);
  }
  const dbSlugs = new Set(articles.map(a => a.slug));
  for (const article of articlesData) {
    if (!dbSlugs.has(article.slug)) add(`/tin-tuc/${article.slug}`, contentDate(article.date));
  }
  for (const article of articles) {
    if (article.isPublished) add(`/tin-tuc/${article.slug}`, article.updatedAt);
  }
  for (const project of projectsData) add(`/du-an/${project.slug}`, contentDate(project.date));
  return Array.from(routes.values());
}
