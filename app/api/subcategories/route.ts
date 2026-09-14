import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { DEFAULT_HIERARCHICAL_CATEGORIES } from "@/lib/subcategories-data";

export const revalidate = 300;

export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: "subcategories_catalog" },
    });

    if (setting && setting.value) {
      try {
        const parsed = JSON.parse(setting.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const merged = parsed.map((cat: any) => {
            const def = DEFAULT_HIERARCHICAL_CATEGORIES.find((d) => d.slug === cat.slug);
            return {
              ...cat,
              banner: cat.banner || def?.banner || "/images/trong-dong-viet-nam.jpg",
            };
          });
          return NextResponse.json(
            { success: true, data: merged },
            {
              headers: {
                "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
              },
            }
          );
        }
      } catch (err) {
        console.error("Parse subcategories_catalog error:", err);
      }
    }

    // Default fallback
    return NextResponse.json(
      {
        success: true,
        data: DEFAULT_HIERARCHICAL_CATEGORIES,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("Public GET Subcategories Error:", error);
    return NextResponse.json(
      { success: true, data: DEFAULT_HIERARCHICAL_CATEGORIES },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  }
}
