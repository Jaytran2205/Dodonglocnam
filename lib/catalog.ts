import { cache } from "react";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { DEFAULT_HIERARCHICAL_CATEGORIES, MainCategoryData, findMainCategory } from "@/lib/subcategories-data";

// Saved catalogue supplies the tree; database categories supply editable main
// names/descriptions. Both storefront and admin read this same representation.
export const loadCatalog = async (): Promise<MainCategoryData[]> => {
  const [setting, categories] = await Promise.all([
    prisma.setting.findUnique({ where: { key: "subcategories_catalog" } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);
  let catalog = DEFAULT_HIERARCHICAL_CATEGORIES;
  if (setting?.value) {
    try {
      const parsed = JSON.parse(setting.value);
      if (Array.isArray(parsed) && parsed.length && parsed.every(c => c.slug && c.name && Array.isArray(c.subCategories))) {
        catalog = parsed;
      }
    } catch { /* Older invalid settings must not break browsing. */ }
  }
  const merged = catalog.map(cat => {
    const defaults = findMainCategory(cat.slug);
    const db = categories.find(c => c.slug === cat.slug || cat.aliases?.includes(c.slug));
    return {
      ...cat,
      aliases: Array.from(new Set([...(defaults?.aliases || []), ...(cat.aliases || [])])),
      name: db?.name || cat.name,
      description: db?.description ?? cat.description,
      banner: cat.banner || defaults?.banner || db?.image || "/images/hero_golden_ship.jpg",
    };
  });
  for (const db of categories) {
    if (!findMainCategory(db.slug, merged) && !["cup-golf", "vat-pham-my-nghe"].includes(db.slug)) {
      merged.push({ name: db.name, slug: db.slug, aliases: [], description: db.description || undefined,
        banner: db.image || "/images/hero_golden_ship.jpg", subCategories: [] });
    }
  }
  return merged;
};

const getCachedCatalog = unstable_cache(loadCatalog, ["storefront-catalog-v2"], {
  revalidate: 300, tags: ["categories", "catalog"],
});

export const getCatalog = cache(async () => {
  try { return await getCachedCatalog(); }
  catch (error) {
    // Never cache an outage fallback, and never expose this fallback to admin saves.
    console.warn("Catalogue unavailable; using bundled storefront catalogue.");
    return DEFAULT_HIERARCHICAL_CATEGORIES;
  }
});
