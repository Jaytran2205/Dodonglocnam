import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import fs from "fs";
import path from "path";

// Secure Admin Guide HTML View - Protected by jaydev
export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession(req);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Yêu cầu đăng nhập quản trị viên." },
        { status: 401 }
      );
    }

    const filePath = path.join(process.cwd(), "docs", "HUONG_DAN_SU_DUNG_ADMIN_DODONGLOCNAM.html");
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { success: false, message: "File tài liệu không tồn tại." },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    return new NextResponse(fileContent, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Lỗi máy chủ." },
      { status: 500 }
    );
  }
}
