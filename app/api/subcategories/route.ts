import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

// Serverless in-memory cache to answer in <1ms without DB round-trips
let memoryCatalog: any = null;
let memoryCatalogTimestamp = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

export async function GET() {
  try {
    const now = Date.now();
    let data = memoryCatalog;
    if (!data || now - memoryCatalogTimestamp > CACHE_TTL_MS) {
      data = await getCatalog();
      memoryCatalog = data;
      memoryCatalogTimestamp = now;
    }
    return NextResponse.json(
      { success: true, data },
      {
        headers: {
          "Cache-Control": "public, max-age=120, s-maxage=600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("Catalogue error:", error);
    return NextResponse.json(
      { success: false, message: "Không tải được danh mục. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
