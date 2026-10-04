import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { AdminTiming } from "@/lib/admin-timing";

export async function GET(req: NextRequest) {
  const timing = new AdminTiming();
  try {
    const session = await timing.measure("auth", () => getAdminSession(req));
    if (!session) return timing.json({ success: false, user: null }, 401);
    return timing.json({ success: true, user: session });
  } catch {
    return timing.json({ success: false, message: "Kết nối database đang gián đoạn. Vui lòng thử lại." }, 503);
  }
}
