import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";

export async function GET() {
  const articles = await prisma.article.findMany({
    orderBy: { publishedAt: "desc" }
  });
  return NextResponse.json({ success: true, articles });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, summary, content, thumbnail, category, subCategoryId, categoryIds, subCategoryIds, tags, isPublished } = await req.json();
    if (!title || !content) {
      return NextResponse.json({ success: false, message: "Tiêu đề và nội dung là bắt buộc." }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-") + "-" + Date.now().toString().slice(-4);

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        summary,
        content,
        thumbnail: thumbnail || "/images/artisan-foundry.jpg",
        category: category || "KIẾN THỨC ĐỒ ĐỒNG",
        subCategoryId: subCategoryId || null,
        categoryIds: categoryIds ? (typeof categoryIds === "string" ? categoryIds : JSON.stringify(categoryIds)) : null,
        subCategoryIds: subCategoryIds ? (typeof subCategoryIds === "string" ? subCategoryIds : JSON.stringify(subCategoryIds)) : null,
        tags: tags || null,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true
      }
    });

    return NextResponse.json({ success: true, message: "Tạo bài viết thành công!", article });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Lỗi tạo bài viết." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, title, summary, content, thumbnail, category, subCategoryId, categoryIds, subCategoryIds, tags, isPublished } = await req.json();
    if (!id || !title) {
      return NextResponse.json({ success: false, message: "Thiếu ID hoặc tiêu đề bài viết." }, { status: 400 });
    }

    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        summary,
        content,
        thumbnail,
        category,
        subCategoryId: subCategoryId || null,
        categoryIds: categoryIds ? (typeof categoryIds === "string" ? categoryIds : JSON.stringify(categoryIds)) : null,
        subCategoryIds: subCategoryIds ? (typeof subCategoryIds === "string" ? subCategoryIds : JSON.stringify(subCategoryIds)) : null,
        tags: tags || null,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true
      }
    });

    return NextResponse.json({ success: true, message: "Cập nhật bài viết thành công!", article });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Lỗi cập nhật bài viết." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "Thiếu ID bài viết." }, { status: 400 });
    }

    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Đã xóa bài viết." });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Lỗi xóa bài viết." }, { status: 500 });
  }
}
