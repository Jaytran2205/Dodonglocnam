import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug?: string[] } }
) {
  const slug = params.slug || [];
  const videoId = slug[0];

  if (!videoId) {
    return new NextResponse("Video ID is required", { status: 400 });
  }

  try {
    // 1. Check if video exists locally on disk first (fastest for local dev)
    const originalExt = slug[1] ? path.extname(slug[1]) : ".mp4";
    const localPath = path.join(
      process.cwd(),
      "public",
      "uploads",
      "videos",
      `video-${videoId}${originalExt}`
    );

    let videoBuffer: Buffer | null = null;
    let mimeType = "video/mp4";

    try {
      videoBuffer = await fs.readFile(localPath);
    } catch {
      // Not on disk (standard on Vercel), fallback to PostgreSQL database
    }

    if (!videoBuffer) {
      const dbVideo = await prisma.uploadedVideo.findUnique({
        where: { id: videoId },
        select: { data: true, mimeType: true, size: true, filename: true },
      });

      if (!dbVideo || !dbVideo.data) {
        return new NextResponse("Video not found", { status: 404 });
      }

      videoBuffer = Buffer.from(dbVideo.data);
      mimeType = dbVideo.mimeType || "video/mp4";
    }

    const totalSize = videoBuffer.length;
    const range = req.headers.get("range");

    // Common caching headers: immutable for Vercel Edge caching
    const commonHeaders: Record<string, string> = {
      "Accept-Ranges": "bytes",
      "Content-Type": mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    };

    if (range) {
      // Range header format: "bytes=start-end"
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      // Serve in chunks of up to 4MB for optimal buffering
      const maxChunk = 4 * 1024 * 1024;
      const requestedEnd = parts[1] ? parseInt(parts[1], 10) : undefined;
      const end =
        requestedEnd !== undefined
          ? Math.min(requestedEnd, totalSize - 1)
          : Math.min(start + maxChunk - 1, totalSize - 1);

      if (start >= totalSize || start > end) {
        return new NextResponse(null, {
          status: 416,
          headers: {
            "Content-Range": `bytes */${totalSize}`,
          },
        });
      }

      const chunkLength = end - start + 1;
      const chunkBuffer = videoBuffer.subarray(start, end + 1);

      return new NextResponse(new Uint8Array(chunkBuffer), {
        status: 206,
        headers: {
          ...commonHeaders,
          "Content-Range": `bytes ${start}-${end}/${totalSize}`,
          "Content-Length": chunkLength.toString(),
        },
      });
    }

    // Full video response
    return new NextResponse(new Uint8Array(videoBuffer), {
      status: 200,
      headers: {
        ...commonHeaders,
        "Content-Length": totalSize.toString(),
      },
    });
  } catch (error: any) {
    console.error("Video Stream Error:", error);
    return new NextResponse("Error streaming video", { status: 500 });
  }
}

export async function HEAD(
  req: NextRequest,
  { params }: { params: { slug?: string[] } }
) {
  const slug = params.slug || [];
  const videoId = slug[0];

  if (!videoId) {
    return new NextResponse(null, { status: 400 });
  }

  try {
    const dbVideo = await prisma.uploadedVideo.findUnique({
      where: { id: videoId },
      select: { size: true, mimeType: true },
    });

    if (!dbVideo) {
      return new NextResponse(null, { status: 404 });
    }

    return new NextResponse(null, {
      status: 200,
      headers: {
        "Accept-Ranges": "bytes",
        "Content-Length": dbVideo.size.toString(),
        "Content-Type": dbVideo.mimeType || "video/mp4",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}
