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
    return NextResponse.json(
      { success: false, message: "Bạn cần đăng nhập quản trị viên để hoàn tất tải video." },
      { status: 401 }
    );
  }

  const hasPerm =
    session.role === "SUPER_ADMIN" ||
    session.role === "ADMIN" ||
    (session.permissions &&
      (session.permissions.includes("products") ||
        session.permissions.includes("articles")));
  if (!hasPerm) {
    return NextResponse.json(
      { success: false, message: "Bạn không có quyền tải video lên." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { uploadId, filename, mimeType, totalChunks } = body;

    if (!uploadId || !filename || typeof totalChunks !== "number" || totalChunks <= 0 || totalChunks > 250) {
      return NextResponse.json(
        { success: false, message: "Thiếu hoặc sai thông tin hoàn tất tải video (uploadId, filename, totalChunks hợp lệ)." },
        { status: 400 }
      );
    }

    // Validate video extension
    const ALLOWED_VIDEO_EXTS: Record<string, string> = {
      ".mp4": "video/mp4",
      ".webm": "video/webm",
      ".mov": "video/quicktime",
    };
    const originalExt = path.extname(filename).toLowerCase();
    if (!ALLOWED_VIDEO_EXTS[originalExt]) {
      return NextResponse.json(
        { success: false, message: "Định dạng video không được hỗ trợ (chỉ chấp nhận .mp4, .webm, .mov)." },
        { status: 400 }
      );
    }

    // Retrieve all chunks ordered by chunkIndex
    const chunks = await prisma.videoChunk.findMany({
      where: { uploadId },
      orderBy: { chunkIndex: "asc" },
    });

    if (chunks.length !== totalChunks) {
      return NextResponse.json(
        {
          success: false,
          message: `Chưa tải đủ các phần video (${chunks.length}/${totalChunks} phần). Vui lòng thử tải lại.`,
        },
        { status: 400 }
      );
    }

    // Verify contiguous sequence of chunks from 0 to totalChunks - 1
    for (let i = 0; i < totalChunks; i++) {
      if (chunks[i].chunkIndex !== i) {
        return NextResponse.json(
          {
            success: false,
            message: `Thiếu hoặc sai thứ tự phần video thứ ${i + 1}.`,
          },
          { status: 400 }
        );
      }
    }

    // Stitch all chunks into one complete buffer
    const fullBuffer = Buffer.concat(chunks.map((c) => c.data));

    // Sanitize extension and filename for safe URL
    const cleanExt = originalExt;
    const cleanBase = path
      .basename(filename, originalExt)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "video";

    const safeFilename = `${cleanBase}${cleanExt}`;

    // Store in UploadedVideo database table (permanent storage)
    const uploadedVideo = await prisma.uploadedVideo.create({
      data: {
        filename: safeFilename,
        mimeType: mimeType || "video/mp4",
        size: fullBuffer.length,
        data: fullBuffer,
      },
    });

    // Clean up temporary chunks in background
    prisma.videoChunk
      .deleteMany({ where: { uploadId } })
      .catch((err) => console.error("Error deleting chunks:", err));

    // Also write to local public/uploads/videos if filesystem is writable (local dev / VPS)
    try {
      const localDir = path.join(process.cwd(), "public", "uploads", "videos");
      await fs.mkdir(localDir, { recursive: true });
      const localFilePath = path.join(localDir, `video-${uploadedVideo.id}${cleanExt}`);
      await fs.writeFile(localFilePath, fullBuffer);
    } catch {
      // Ignored on read-only serverless platforms like Vercel
    }

    const publicUrl = `/api/videos/${uploadedVideo.id}/${safeFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      videoId: uploadedVideo.id,
      filename: safeFilename,
      size: uploadedVideo.size,
      type: uploadedVideo.mimeType,
      message: "Tải và tối ưu hóa video thành công!",
    });
  } catch (error: any) {
    console.error("Complete Video Upload Error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Lỗi xử lý hoàn tất video." },
      { status: 500 }
    );
  }
}
