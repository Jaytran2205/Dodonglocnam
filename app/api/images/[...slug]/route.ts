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
  const imageId = slug[0];

  if (!imageId) {
    return new NextResponse("Image ID is required", { status: 400 });
  }

  try {
    const filename = slug[1] || "";
    const originalExt = filename ? path.extname(filename) : ".jpg";

    // 1. Check local disk first (for fast local dev)
    const localPath = path.join(
      process.cwd(),
      "public",
      "uploads",
      `img-${imageId}${originalExt}`
    );

    let imageBuffer: Buffer | null = null;
    let mimeType = "image/jpeg";

    try {
      imageBuffer = await fs.readFile(localPath);
      if (originalExt === ".png") mimeType = "image/png";
      else if (originalExt === ".webp") mimeType = "image/webp";
      else if (originalExt === ".gif") mimeType = "image/gif";
      else if (originalExt === ".svg") mimeType = "image/svg+xml";
    } catch {
      // Not on disk (standard on Vercel serverless), fallback to database
    }

    if (!imageBuffer) {
      const dbImage = await prisma.uploadedImage.findUnique({
        where: { id: imageId },
        select: { data: true, mimeType: true, size: true, filename: true },
      });

      if (!dbImage || !dbImage.data) {
        return new NextResponse("Image not found", { status: 404 });
      }

      imageBuffer = Buffer.from(dbImage.data);
      mimeType = dbImage.mimeType || "image/jpeg";
    }

    return new NextResponse(new Uint8Array(imageBuffer), {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: any) {
    console.error("Serve Image Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
