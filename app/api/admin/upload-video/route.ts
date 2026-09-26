import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Bạn cần đăng nhập để tải video lên." }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: "Không tìm thấy tệp video tải lên." }, { status: 400 });
    }

    const MAX_SIZE = 250 * 1024 * 1024; // 250MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: "Dung lượng video vượt quá 250MB. Vui lòng nén video hoặc chọn tệp nhỏ hơn." },
        { status: 400 }
      );
    }

    const originalExt = path.extname(file.name) || ".mp4";
    const cleanExt = originalExt.toLowerCase();
    const allowedExts = [".mp4", ".webm", ".mov", ".ogg", ".avi", ".mkv", ".m4v"];

    const isVideoMime = file.type?.startsWith("video/") || false;
    const isVideoExt = allowedExts.includes(cleanExt);

    if (!isVideoMime && !isVideoExt) {
      return NextResponse.json(
        { success: false, message: "Định dạng tệp không được hỗ trợ. Vui lòng chọn tệp video (MP4, WebM, MOV, OGG...)" },
        { status: 400 }
      );
    }

    // Sanitize base name (remove accents, special characters)
    const baseName = path.basename(file.name, originalExt)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 30) || "video";

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Save to PostgreSQL database (UploadedVideo) for guaranteed permanence across serverless instances
    const cleanBaseName = baseName.replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase();
    const safeFilename = `${cleanBaseName}${cleanExt}`;

    const uploadedVideo = await prisma.uploadedVideo.create({
      data: {
        filename: safeFilename,
        mimeType: file.type || "video/mp4",
        size: buffer.length,
        data: buffer,
      },
    });

    // 2. Optionally write to local disk if writable (local dev cache)
    try {
      const videoUploadsDir = path.join(process.cwd(), "public", "uploads", "videos");
      await fs.mkdir(videoUploadsDir, { recursive: true });
      const localFilePath = path.join(videoUploadsDir, `video-${uploadedVideo.id}${cleanExt}`);
      await fs.writeFile(localFilePath, buffer);
    } catch {
      // Ignored on read-only serverless platforms like Vercel
    }

    const publicUrl = `/api/videos/${uploadedVideo.id}/${safeFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      videoId: uploadedVideo.id,
      filename: safeFilename,
      size: file.size,
      type: file.type || "video/mp4",
      message: "Tải video lên máy chủ thành công!"
    });
  } catch (error: any) {
    console.error("Video Upload Error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Lỗi tải video lên máy chủ." },
      { status: 500 }
    );
  }
}
