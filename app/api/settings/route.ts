import { NextResponse } from "next/server";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

// Serverless in-memory cache to answer in <1ms without DB round-trips
let memorySettings: Record<string, string> | null = null;
let memorySettingsTimestamp = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

export async function GET() {
  try {
    const now = Date.now();
    let settings = memorySettings;
    if (!settings || now - memorySettingsTimestamp > CACHE_TTL_MS) {
      settings = await getSettings();
      memorySettings = settings;
      memorySettingsTimestamp = now;
    }
    return NextResponse.json(
      { success: true, settings },
      {
        headers: {
          "Cache-Control": "public, max-age=120, s-maxage=600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("Settings error:", error);
    return NextResponse.json({ success: false, settings: {} }, { status: 500 });
  }
}
