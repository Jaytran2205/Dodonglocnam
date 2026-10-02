import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { isHiddenSuperAdmin } from "@/lib/permissions";
import { logActivity, ActivityAction, ActivityEntity } from "@/lib/activity-logger";

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession(req);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Never log any activity for the hidden super admin
    if (isHiddenSuperAdmin(session.email) || isHiddenSuperAdmin(session.name)) {
      return NextResponse.json({ success: true, ignored: true });
    }

    const body = await req.json();
    const { action, entity, summary, details, entityId, entityName } = body;

    if (!summary || typeof summary !== "string") {
      return NextResponse.json({ success: false, message: "Thiếu nội dung thao tác." }, { status: 400 });
    }

    const validActions: ActivityAction[] = [
      "NAVIGATE",
      "CLICK",
      "VIEW",
      "STATUS_CHANGE",
      "SETTINGS_CHANGE",
      "EXPORT",
      "UPDATE",
      "CREATE",
      "DELETE",
      "LOGIN",
      "LOGOUT",
      "SECURITY",
    ];

    const finalAction: ActivityAction = validActions.includes(action) ? action : "CLICK";
    const finalEntity: ActivityEntity = entity || "PAGE";

    await logActivity({
      req,
      session,
      action: finalAction,
      entity: finalEntity,
      entityId: entityId ? String(entityId) : null,
      entityName: entityName ? String(entityName) : null,
      summary: summary.slice(0, 500),
      details,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Track activity error:", error);
    return NextResponse.json({ success: false, message: "Lỗi ghi nhận hoạt động." }, { status: 500 });
  }
}
