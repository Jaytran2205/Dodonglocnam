import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { articlesData } from "./tin-tuc/articlesData";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.quatanglocnam.com";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/gioi-thieu`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/san-pham`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tin-tuc`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ki-thuc-do-dong`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/bo-suu-tap`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/video`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/lien-he`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Dynamic Category routes
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const categories = await prisma.category.findMany({
      select: { slug: true, updatedAt: true },
    });

    categoryRoutes = categories.map((cat) => ({
      url: `${baseUrl}/san-pham/${cat.slug}`,
      lastModified: cat.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));
  } catch (err) {
    console.error("Error generating sitemap categories:", err);
  }

  // Dynamic Product routes
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await prisma.product.findMany({
      select: {
        slug: true,
        updatedAt: true,
        category: {
          select: { slug: true },
        },
      },
    });

    productRoutes = products.map((prod) => ({
      url: `${baseUrl}/san-pham/${prod.category.slug}/${prod.slug}`,
      lastModified: prod.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (err) {
    console.error("Error generating sitemap products:", err);
  }

  // Article routes
  const articleRoutes: MetadataRoute.Sitemap = articlesData.map((art) => ({
    url: `${baseUrl}/tin-tuc/${art.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...articleRoutes];
}
