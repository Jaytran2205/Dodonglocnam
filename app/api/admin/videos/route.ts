import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Bạn cần đăng nhập quản trị viên." },
      { status: 401 }
    );
  }

  try {
    const videos = await prisma.uploadedVideo.findMany({
      select: {
        id: true,
        filename: true,
        mimeType: true,
        size: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const totalBytes = videos.reduce((acc, v) => acc + (v.size || 0), 0);
    const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);

    const formattedVideos = videos.map((v) => ({
      id: v.id,
      filename: v.filename,
      mimeType: v.mimeType,
      size: v.size,
      sizeFormatted:
        v.size < 1024 * 1024
          ? `${(v.size / 1024).toFixed(1)} KB`
          : `${(v.size / (1024 * 1024)).toFixed(1)} MB`,
      createdAt: v.createdAt,
      url: `/api/videos/${v.id}/${v.filename}`,
    }));

    return NextResponse.json({
      success: true,
      videos: formattedVideos,
      count: videos.length,
      totalBytes,
      totalMB: parseFloat(totalMB),
    });
  } catch (error: any) {
    console.error("Fetch Videos Error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Lỗi tải danh sách video." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Bạn cần đăng nhập quản trị viên." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Thiếu mã định danh video (ID)." },
      { status: 400 }
    );
  }

  try {
    const existing = await prisma.uploadedVideo.findUnique({
      where: { id },
      select: { id: true, filename: true, size: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy video để xóa." },
        { status: 404 }
      );
    }

    await prisma.uploadedVideo.delete({
      where: { id },
    });

    // Try deleting local disk cache if exists
    try {
      const ext = path.extname(existing.filename) || ".mp4";
      const localPath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "videos",
        `video-${id}${ext}`
      );
      await fs.unlink(localPath);
    } catch {
      // Ignored if file does not exist on disk
    }

    // Log admin activity
    try {
      await prisma.activityLog.create({
        data: {
          userId: session.userId,
          userEmail: session.email,
          userName: session.name,
          userRole: session.role,
          action: "DELETE",
          entity: "SYSTEM",
          entityId: id,
          entityName: existing.filename,
          summary: `Đã xóa video "${existing.filename}" (${(existing.size / (1024 * 1024)).toFixed(1)} MB) khỏi kho lưu trữ`,
        },
      });
    } catch {}

    return NextResponse.json({
      success: true,
      message: `Đã xóa thành công video "${existing.filename}".`,
    });
  } catch (error: any) {
    console.error("Delete Video Error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Lỗi xóa video." },
      { status: 500 }
    );
  }
}
