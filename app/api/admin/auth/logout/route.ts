import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, invalidateAdminSession } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity-logger";

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession(req);
    if (session) {
      invalidateAdminSession(session.userId);
      await logActivity({
        req,
        session,
        action: "LOGOUT",
        entity: "AUTH",
        summary: `Đăng xuất khỏi hệ thống quản trị (${session.name || session.email})`,
        details: { role: session.role, email: session.email },
      });
    }
  } catch {}

  const response = NextResponse.json({ success: true, message: "Đã đăng xuất" });
  response.cookies.delete("admin_token");
  return response;
}
