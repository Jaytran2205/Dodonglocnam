import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Maximum individual chunk size allowed (4MB, safely below Vercel's 4.5MB payload limit)
const MAX_CHUNK_SIZE = 4 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Bạn cần đăng nhập quản trị viên để tải video lên." },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();
    const uploadId = formData.get("uploadId") as string | null;
    const chunkIndexStr = formData.get("chunkIndex") as string | null;
    const totalChunksStr = formData.get("totalChunks") as string | null;
    const chunkFile = formData.get("chunk") as File | null;

    if (!uploadId || chunkIndexStr === null || !chunkFile) {
      return NextResponse.json(
        { success: false, message: "Dữ liệu phần video (chunk) không hợp lệ." },
        { status: 400 }
      );
    }

    const chunkIndex = parseInt(chunkIndexStr, 10);
    const totalChunks = totalChunksStr ? parseInt(totalChunksStr, 10) : 1;

    if (isNaN(chunkIndex) || chunkIndex < 0) {
      return NextResponse.json(
        { success: false, message: "Chỉ mục chunk không hợp lệ." },
        { status: 400 }
      );
    }

    if (chunkFile.size > MAX_CHUNK_SIZE) {
      return NextResponse.json(
        { success: false, message: "Kích thước phần video vượt quá giới hạn 4MB." },
        { status: 400 }
      );
    }

    const bytes = await chunkFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save or update chunk in database
    await prisma.videoChunk.upsert({
      where: {
        uploadId_chunkIndex: {
          uploadId,
          chunkIndex,
        },
      },
      update: {
        data: buffer,
      },
      create: {
        uploadId,
        chunkIndex,
        data: buffer,
      },
    });

    return NextResponse.json({
      success: true,
      uploadId,
      chunkIndex,
      totalChunks,
      receivedSize: buffer.length,
    });
  } catch (error: any) {
    console.error("Chunk Upload Error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Lỗi lưu phần video tải lên." },
      { status: 500 }
    );
  }
}
