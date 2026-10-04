import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";

export const getAdminCategoryOptions = unstable_cache(
  () =>
    prisma.category.findMany({
      orderBy: { order: "asc" },
      select: { id: true, name: true, slug: true },
    }),
  ["admin-category-options-v1"],
  { revalidate: 60, tags: ["categories"] }
);
