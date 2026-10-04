import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/catalog";
export const dynamic = "force-dynamic";
export async function GET() {
  try { return NextResponse.json({ success: true, data: await getCatalog() }, { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { console.error("Catalogue error:", error); return NextResponse.json({ success: false, message: "Không tải được danh mục. Vui lòng thử lại." }, { status: 500 }); }
}
