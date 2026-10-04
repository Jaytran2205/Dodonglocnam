import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity-logger";

export async function GET(req: NextRequest) {
  const session = await getAdminSession(req);
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (id) {
    const article = await prisma.article.findFirst({ where: { id, ...(!session ? { isPublished: true } : {}) } });
    return article ? NextResponse.json({ success: true, article }) : NextResponse.json({ success: false, message: "Không tìm thấy bài viết." }, { status: 404 });
  }
  const where: any = {};
  if (!session) {
    where.isPublished = true;
  }
  if (searchParams.get("facilityOnly") === "1") where.slug = { in: ["nghe-nhan-duong-ba-tien", "xuong-san-xuat-duc-dong-loc-nam"] };
  const articles = await prisma.article.findMany({
    where,
    ...(searchParams.get("view") === "list" ? { select: {
      id: true, title: true, slug: true, summary: true, thumbnail: true, category: true, tags: true,
      isPublished: true, viewCount: true, publishedAt: true, createdAt: true, updatedAt: true,
      subCategoryId: true, categoryIds: true, subCategoryIds: true,
    } } : {}),
    orderBy: { publishedAt: "desc" }
  });
  return NextResponse.json({ success: true, articles });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const hasPerm = session.role === "SUPER_ADMIN" || session.role === "ADMIN" || (session.permissions && session.permissions.includes("articles"));
  if (!hasPerm) {
    return NextResponse.json({ success: false, message: "Bạn không có quyền tạo bài viết." }, { status: 403 });
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

    revalidateTag("articles"); revalidateTag("media"); revalidatePath("/", "layout"); revalidatePath("/sitemap.xml");

    logActivity({
      req,
      session,
      action: "CREATE",
      entity: "ARTICLE",
      entityId: article.id,
      entityName: article.title,
      summary: `Tạo bài viết mới: "${article.title}"`,
      details: { category: article.category, isPublished: article.isPublished },
    }).catch(() => {});

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

  const hasPerm = session.role === "SUPER_ADMIN" || session.role === "ADMIN" || (session.permissions && session.permissions.includes("articles"));
  if (!hasPerm) {
    return NextResponse.json({ success: false, message: "Bạn không có quyền chỉnh sửa bài viết." }, { status: 403 });
  }

  try {
    const { id, title, summary, content, thumbnail, category, subCategoryId, categoryIds, subCategoryIds, tags, isPublished } = await req.json();
    if (!id || !title) {
      return NextResponse.json({ success: false, message: "Thiếu ID hoặc tiêu đề bài viết." }, { status: 400 });
    }

    const article = await prisma.article.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(summary !== undefined && { summary }),
        ...(content !== undefined && { content }),
        ...(thumbnail !== undefined && { thumbnail }),
        ...(category !== undefined && { category }),
        ...(subCategoryId !== undefined && { subCategoryId }),
        ...(categoryIds !== undefined && { categoryIds: typeof categoryIds === "string" ? categoryIds : JSON.stringify(categoryIds) }),
        ...(subCategoryIds !== undefined && { subCategoryIds: typeof subCategoryIds === "string" ? subCategoryIds : JSON.stringify(subCategoryIds) }),
        ...(tags !== undefined && { tags }),
        ...(isPublished !== undefined && { isPublished: Boolean(isPublished) }),
      },
    });

    revalidateTag("articles"); revalidateTag("media"); revalidatePath("/", "layout"); revalidatePath("/sitemap.xml");

    logActivity({
      req,
      session,
      action: "UPDATE",
      entity: "ARTICLE",
      entityId: article.id,
      entityName: article.title,
      summary: `Cập nhật bài viết: "${article.title}"`,
      details: { category: article.category, isPublished: article.isPublished },
    }).catch(() => {});

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

  const hasPerm = session.role === "SUPER_ADMIN" || session.role === "ADMIN" || (session.permissions && session.permissions.includes("articles"));
  if (!hasPerm) {
    return NextResponse.json({ success: false, message: "Bạn không có quyền xóa bài viết." }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "Thiếu ID bài viết." }, { status: 400 });
    }

    const existing = await prisma.article.findUnique({ where: { id } });
    await prisma.article.delete({ where: { id } });

    if (existing) {
      revalidateTag("articles"); revalidateTag("media"); revalidatePath("/", "layout"); revalidatePath("/sitemap.xml");

    logActivity({
        req,
        session,
        action: "DELETE",
        entity: "ARTICLE",
        entityId: id,
        entityName: existing.title,
        summary: `Xóa bài viết: "${existing.title}"`,
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, message: "Đã xóa bài viết." });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Lỗi xóa bài viết." }, { status: 500 });
  }
}
