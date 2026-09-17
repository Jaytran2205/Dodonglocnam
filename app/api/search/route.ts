import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { removeVietnameseTones } from "@/lib/utils";

export const dynamic = "force-dynamic";

let cachedProducts: any[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

async function getCachedProducts() {
  const now = Date.now();
  if (cachedProducts && now - lastCacheTime < CACHE_TTL_MS) {
    return cachedProducts;
  }
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      images: true,
      category: {
        select: { name: true, slug: true },
      },
    },
    take: 1000,
  });
  cachedProducts = products;
  lastCacheTime = now;
  return products;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || searchParams.get("search") || "";
    const cleanQ = removeVietnameseTones(q.trim().toLowerCase());

    if (!cleanQ) {
      return NextResponse.json(
        { success: true, products: [] },
        {
          headers: {
            "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
          },
        }
      );
    }

    const products = await getCachedProducts();

    const qTokens = cleanQ.split(/\s+/).filter(Boolean);
    const scored: {
      id: string;
      name: string;
      slug: string;
      price: number | null;
      image: string;
      categorySlug: string;
      categoryName: string;
      score: number;
    }[] = [];

    for (const p of products) {
      const rawN = (p.name || "").toLowerCase();
      const cleanN = removeVietnameseTones(rawN);
      const nWords = cleanN.split(/[\s,./()_+-]+/).filter(Boolean);

      const rawCat = (p.category?.name || "").toLowerCase();
      const cleanCat = removeVietnameseTones(rawCat);
      const catWords = cleanCat.split(/[\s,./()_+-]+/).filter(Boolean);

      let score = 0;

      // 1. Exact phrase match in name
      if (rawN.includes(q.trim().toLowerCase())) {
        score = 1000;
      } else if (cleanN.includes(cleanQ)) {
        score = 900;
      }
      // 2. All tokens match whole words in name
      else if (qTokens.every((t) => nWords.includes(t))) {
        score = 800;
      }
      // 3. Multi-word match across name + category
      else if (qTokens.length > 1) {
        const allWords = [...nWords, ...catWords];
        if (
          qTokens.every((t) => allWords.includes(t)) &&
          qTokens.some((t) => nWords.includes(t))
        ) {
          score = 700;
        }
      }
      // 4. Single token match in name
      else if (
        qTokens.length === 1 &&
        (nWords.includes(qTokens[0]) || nWords.some((w) => w.startsWith(qTokens[0])))
      ) {
        score = 500;
      }

      if (score > 0) {
        let firstImg = "/images/hero_golden_ship.jpg";
        try {
          const parsed = JSON.parse(p.images);
          if (Array.isArray(parsed) && parsed[0]) firstImg = parsed[0];
          else if (typeof parsed === "string") firstImg = parsed;
        } catch {
          if (p.images) firstImg = p.images;
        }

        scored.push({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          image: firstImg,
          categorySlug: p.category.slug,
          categoryName: p.category.name,
          score,
        });
      }
    }

    scored.sort((a, b) => b.score - a.score);

    return NextResponse.json(
      {
        success: true,
        products: scored.slice(0, 8),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
