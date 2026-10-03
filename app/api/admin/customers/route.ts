import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { checkUserPermission } from "@/lib/permissions";

export async function GET(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  if (!checkUserPermission(session.role, session.permissions ? JSON.stringify(session.permissions) : null, "customers")) {
    return NextResponse.json({ success: false, message: "Bạn không có quyền truy cập dữ liệu khách hàng." }, { status: 403 });
  }

  const customers = await prisma.customer.findMany({
    orderBy: { totalSpent: "desc" }
  });

  return NextResponse.json({ success: true, customers });
}
