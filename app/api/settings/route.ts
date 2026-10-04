import { NextResponse } from "next/server";
import { getSettings } from "@/lib/settings";
export const dynamic = "force-dynamic";
export async function GET() {
  try { return NextResponse.json({ success: true, settings: await getSettings() }, { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { console.error("Settings error:", error); return NextResponse.json({ success: false, settings: {} }, { status: 500 }); }
}
