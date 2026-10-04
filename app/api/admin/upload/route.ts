import { revalidateTag } from "next/cache";
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
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const hasPerm =
    session.role === "SUPER_ADMIN" ||
    session.role === "ADMIN" ||
    (session.permissions &&
      (session.permissions.includes("products") ||
        session.permissions.includes("articles") ||
        session.permissions.includes("landing") || session.permissions.includes("categories")));
  if (!hasPerm) {
    return NextResponse.json({ success: false, message: "Bạn không có quyền tải tệp lên." }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: "Không tìm thấy tệp tải lên" }, { status: 400 });
    }

    const originalExt = path.extname(file.name) || ".jpg";
    const cleanExt = originalExt.toLowerCase();

    const ALLOWED_IMAGE_MAP: Record<string, string[]> = {
      ".jpg": ["image/jpeg", "image/jpg"],
      ".jpeg": ["image/jpeg", "image/jpg"],
      ".png": ["image/png"],
      ".webp": ["image/webp"],
      ".gif": ["image/gif"],
    };

    const ALLOWED_VIDEO_MAP: Record<string, string[]> = {
      ".mp4": ["video/mp4"],
      ".webm": ["video/webm"],
      ".mov": ["video/quicktime", "video/mp4"],
    };

    const fileType = (file.type || "").toLowerCase();
    const isImage = cleanExt in ALLOWED_IMAGE_MAP && ALLOWED_IMAGE_MAP[cleanExt].includes(fileType);
    const isVideo = cleanExt in ALLOWED_VIDEO_MAP && ALLOWED_VIDEO_MAP[cleanExt].includes(fileType);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { success: false, message: "Định dạng tệp không được hỗ trợ hoặc phần mở rộng không khớp với loại MIME. Chỉ chấp nhận ảnh (JPG, PNG, WebP, GIF) hoặc video (MP4, WebM, MOV)." },
        { status: 400 }
      );
    }

    // Size limit: 10MB for image, 50MB for video
    const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
    const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

    if (isImage && file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { success: false, message: `Dung lượng ảnh vượt quá giới hạn cho phép (tối đa 10MB). Kích thước file: ${(file.size / (1024 * 1024)).toFixed(1)}MB.` },
        { status: 400 }
      );
    }

    if (isVideo && file.size > MAX_VIDEO_SIZE) {
      return NextResponse.json(
        { success: false, message: `Dung lượng video vượt quá giới hạn cho phép (tối đa 50MB).` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (isImage) {
      const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
      const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
      const isGif = buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46;
      const isWebp = buffer.length > 12 && buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50;
      if (!isJpeg && !isPng && !isGif && !isWebp) {
        return NextResponse.json(
          { success: false, message: "Tệp tin không đúng định dạng ảnh thực tế (magic bytes không khớp)." },
          { status: 400 }
        );
      }
    }

    const prefix = isVideo ? "video" : "img";
    const safeName = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${cleanExt}`;

    let publicUrl = "";

    if (isImage) {
      // 1. Store in Database for guaranteed permanence across Vercel serverless deployments
      const uploadedImg = await prisma.uploadedImage.create({
        data: {
          filename: safeName,
          mimeType: file.type || (cleanExt === ".png" ? "image/png" : cleanExt === ".webp" ? "image/webp" : "image/jpeg"),
          size: buffer.length,
          data: buffer,
        },
      });

      // 2. Try writing to local disk cache (safe on local dev, quietly skipped on read-only serverless)
      try {
        const targetDir = path.join(process.cwd(), "public", "uploads");
        await fs.mkdir(targetDir, { recursive: true });
        await fs.writeFile(path.join(targetDir, `img-${uploadedImg.id}${cleanExt}`), buffer);
      } catch {
        // Ignored on read-only serverless platforms like Vercel
      }

      publicUrl = `/api/images/${uploadedImg.id}/${safeName}`;
    } else {
      // Store video in Database
      const uploadedVid = await prisma.uploadedVideo.create({
        data: {
          filename: safeName,
          mimeType: file.type || "video/mp4",
          size: buffer.length,
          data: buffer,
        },
      });

      try {
        const targetDir = path.join(process.cwd(), "public", "uploads", "videos");
        await fs.mkdir(targetDir, { recursive: true });
        await fs.writeFile(path.join(targetDir, `video-${uploadedVid.id}${cleanExt}`), buffer);
      } catch {
        // Ignored on read-only serverless platforms
      }

      publicUrl = `/api/videos/${uploadedVid.id}/${safeName}`;
    }

    revalidateTag("media");
    return NextResponse.json({
      success: true,
      url: publicUrl,
      message: "Tải lên thành công!"
    });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { success: false, message: `Lỗi tải tệp lên máy chủ: ${error?.message || "Không xác định"}` },
      { status: 500 }
    );
  }
}
