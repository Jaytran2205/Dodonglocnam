import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";

export async function GET() {
  const settings = await prisma.setting.findMany();
  const settingsMap: { [key: string]: string } = {};
  settings.forEach(s => {
    settingsMap[s.key] = s.value;
  });
  return NextResponse.json({ success: true, settings: settingsMap, list: settings });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { settings } = await req.json(); // { hotline_1: "...", showroom_hn: "...", ... }

    if (!settings || typeof settings !== "object") {
      return NextResponse.json({ success: false, message: "Dữ liệu không hợp lệ." }, { status: 400 });
    }

    for (const [key, value] of Object.entries(settings)) {
      await prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: {
          key,
          value: String(value),
          group: "GENERAL"
        }
      });
    }

    return NextResponse.json({ success: true, message: "Đã cập nhật nội dung Landing Page thành công!" });
  } catch (error: any) {
    console.error("Save Settings Error:", error);
    return NextResponse.json({ success: false, message: "Lỗi lưu cài đặt." }, { status: 500 });
  }
}
