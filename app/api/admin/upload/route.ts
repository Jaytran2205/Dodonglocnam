import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: "Không tìm thấy tệp tải lên" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalExt = path.extname(file.name) || ".jpg";
    const cleanExt = originalExt.toLowerCase();
    const isVideo = file.type?.startsWith("video/") || [".mp4", ".webm", ".mov", ".ogg", ".avi", ".mkv"].includes(cleanExt);
    
    const targetDir = isVideo
      ? path.join(process.cwd(), "public", "uploads", "videos")
      : path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(targetDir, { recursive: true });

    const prefix = isVideo ? "video" : "sp";
    const safeName = `${prefix}-${Date.now()}-${Math.random().toString(36).charAt(2)}${Math.random().toString(36).slice(2, 6)}${cleanExt}`;
    const filePath = path.join(targetDir, safeName);

    await fs.writeFile(filePath, buffer);

    const publicUrl = isVideo ? `/uploads/videos/${safeName}` : `/uploads/${safeName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      message: "Tải ảnh thành công!"
    });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi tải ảnh lên máy chủ" },
      { status: 500 }
    );
  }
}
