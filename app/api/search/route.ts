import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { removeVietnameseTones } from "@/lib/utils";

export const dynamic = "force-dynamic";

let cachedProducts: any[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 30 * 1000; // 30 seconds cache for freshness

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
    orderBy: { createdAt: "desc" },
    take: 5000,
  });
  cachedProducts = products;
  lastCacheTime = now;
  return products;
}

// Synonyms dictionary for bronze handicraft & spiritual items
const SYNONYM_MAP: Record<string, string[]> = {
  "ong hoang": ["quan hoang"],
  "quan hoang": ["ong hoang"],
  "ong hoang muoi": ["quan hoang muoi"],
  "quan hoang muoi": ["ong hoang muoi"],
  "ong hoang bay": ["quan hoang bay"],
  "quan hoang bay": ["ong hoang bay"],
  "quan cong": ["quan van truong"],
  "quan van truong": ["quan cong"],
  "thuyen buom": ["thuan buom xuoi gio", "thuan buom"],
  "phat ba": ["quan am", "me quan am"],
  "hoang de": ["vua"],
  "dieu khac": ["duc", "cham"],
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || searchParams.get("search") || "").trim();
    const cleanQ = removeVietnameseTones(q.toLowerCase());

    if (!cleanQ) {
      return NextResponse.json(
        { success: true, products: [] },
        {
          headers: {
            "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
          },
        }
      );
    }

    const products = await getCachedProducts();

    // Expand search query with synonyms
    const searchPhrases = [cleanQ];
    for (const [key, syns] of Object.entries(SYNONYM_MAP)) {
      if (cleanQ.includes(key)) {
        for (const syn of syns) {
          searchPhrases.push(cleanQ.replace(key, syn));
        }
      }
    }

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

    const isSpecificAnimalSearch = /\b(hổ|cọp|rắn|khỉ|dê|gà|chó|lợn|heo|mèo|chuột|trâu)\b/i.test(q);

    for (const p of products) {
      const rawN = (p.name || "").toLowerCase();
      const cleanN = removeVietnameseTones(rawN);
      const nWords = cleanN.split(/[\s,./()_+-]+/).filter(Boolean);

      const rawCat = (p.category?.name || "").toLowerCase();
      const cleanCat = removeVietnameseTones(rawCat);
      const catWords = cleanCat.split(/[\s,./()_+-]+/).filter(Boolean);

      let score = 0;

      // 1. Exact phrase match or synonym phrase match
      for (const phrase of searchPhrases) {
        if (cleanN.includes(phrase)) {
          score = Math.max(score, phrase === cleanQ ? 1000 : 950);
        }
      }

      // If user specifically typed with diacritics (e.g. "hổ")
      if (isSpecificAnimalSearch && q.toLowerCase() === "hổ") {
        if (!/\b(hổ|cọp)\b/i.test(rawN)) {
          // Skip if it doesn't actually contain the animal "hổ"
          continue;
        }
      }

      // 2. All tokens match whole words in name
      if (score === 0 && qTokens.every((t) => nWords.includes(t))) {
        score = 800;
      }
      // 3. Multi-word match across name + category
      else if (score === 0 && qTokens.length > 1) {
        const allWords = [...nWords, ...catWords];
        if (
          qTokens.every((t) => allWords.includes(t)) &&
          qTokens.some((t) => nWords.includes(t))
        ) {
          score = 700;
        }
      }
      // 4. Single token match: only allow startsWith if token has 3 or more chars
      else if (score === 0 && qTokens.length === 1) {
        const singleToken = qTokens[0];
        if (nWords.includes(singleToken)) {
          score = 600;
        } else if (singleToken.length >= 3 && nWords.some((w) => w.startsWith(singleToken))) {
          score = 400;
        }
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
