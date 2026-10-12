import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import fs from "fs";
import path from "path";

// Secure Admin Guide Delivery Engine - Protected by jaydev
export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession(req);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Yêu cầu đăng nhập quản trị viên để tải tài liệu." },
        { status: 401 }
      );
    }

    const filePath = path.join(process.cwd(), "docs", "HUONG_DAN_SU_DUNG_ADMIN_DODONGLOCNAM.pdf");
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { success: false, message: "File tài liệu không tồn tại." },
        { status: 404 }
      );
    }

    const fileBuffer = fs.readFileSync(filePath);
    const isInline = req.nextUrl.searchParams.get("view") === "inline";
    const disposition = isInline ? "inline" : "attachment";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${disposition}; filename="HUONG_DAN_SU_DUNG_ADMIN_DODONGLOCNAM.pdf"`,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Lỗi máy chủ khi tải tài liệu." },
      { status: 500 }
    );
  }
}
