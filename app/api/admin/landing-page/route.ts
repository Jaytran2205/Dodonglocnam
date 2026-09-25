import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/activity-logger";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    const settingsMap: { [key: string]: string } = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });
    return NextResponse.json({ success: true, settings: settingsMap, list: settings });
  } catch (error: any) {
    console.error("GET Settings Error:", error);
    return NextResponse.json({ success: false, message: "Lỗi tải cấu hình" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { settings } = await req.json();

    if (!settings || typeof settings !== "object") {
      return NextResponse.json({ success: false, message: "Dữ liệu không hợp lệ." }, { status: 400 });
    }

    const entries = Object.entries(settings).filter(
      ([, value]) => value !== undefined && value !== null
    );

    if (entries.length === 0) {
      return NextResponse.json({ success: true, message: "Không có dữ liệu cần cập nhật." });
    }

    // Nếu chỉ gửi ít trường (<= 15 trường), thực hiện cập nhật theo lô trực tiếp qua $transaction
    if (entries.length <= 15) {
      const operations = entries.map(([key, value]) =>
        prisma.setting.upsert({
          where: { key },
          update: { value: String(value) },
          create: {
            key,
            value: String(value),
            group: "GENERAL",
          },
        })
      );
      await prisma.$transaction(operations);

      try {
        revalidatePath("/", "layout");
      } catch {}

      logActivity({
        req,
        session,
        action: "SETTINGS_CHANGE",
        entity: "SETTING",
        summary: `Cập nhật cấu hình website (${entries.length} thiết lập)`,
        details: { keys: entries.map(([k]) => k) },
      }).catch(() => {});

      return NextResponse.json({
        success: true,
        message: `Đã lưu thành công ${entries.length} mục cài đặt!`,
        updatedCount: entries.length,
      });
    }

    // Trường hợp gửi toàn bộ danh sách cài đặt (> 15 trường), so sánh với DB để chỉ cập nhật những trường thực sự thay đổi
    const existing = await prisma.setting.findMany();
    const existingMap = new Map(existing.map((s) => [s.key, s.value]));

    const changedEntries = entries.filter(([key, value]) => {
      return !existingMap.has(key) || existingMap.get(key) !== String(value);
    });

    if (changedEntries.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Cấu hình hiện tại đã là mới nhất, không có gì thay đổi.",
        updatedCount: 0,
      });
    }

    // Thực hiện upsert các trường thay đổi theo lô (chunk 25) để tránh timeout hoặc quá tải connection pool
    const CHUNK_SIZE = 25;
    for (let i = 0; i < changedEntries.length; i += CHUNK_SIZE) {
      const chunk = changedEntries.slice(i, i + CHUNK_SIZE);
      const operations = chunk.map(([key, value]) =>
        prisma.setting.upsert({
          where: { key },
          update: { value: String(value) },
          create: {
            key,
            value: String(value),
            group: "GENERAL",
          },
        })
      );
      await prisma.$transaction(operations);
    }

    try {
      revalidatePath("/", "layout");
    } catch {}

    logActivity({
      req,
      session,
      action: "SETTINGS_CHANGE",
      entity: "SETTING",
      summary: `Cập nhật giao diện & cài đặt website (${changedEntries.length} mục thay đổi)`,
      details: { changedKeys: changedEntries.map(([k]) => k) },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: `Đã lưu thành công ${changedEntries.length} mục thay đổi!`,
      updatedCount: changedEntries.length,
    });
  } catch (error: any) {
    console.error("Save Settings Error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi lưu cài đặt: " + (error?.message || "Lỗi máy chủ") },
      { status: 500 }
    );
  }
}
