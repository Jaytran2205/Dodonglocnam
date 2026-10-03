import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity-logger";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } }
  });
  return NextResponse.json({ success: true, categories });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const hasPerm = session.role === "SUPER_ADMIN" || session.role === "ADMIN" || (session.permissions && session.permissions.includes("categories"));
  if (!hasPerm) {
    return NextResponse.json({ success: false, message: "Bạn không có quyền thêm danh mục." }, { status: 403 });
  }

  try {
    const { name, description, image, order } = await req.json();
    if (!name) {
      return NextResponse.json({ success: false, message: "Tên danh mục là bắt buộc." }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        image,
        order: order ? parseInt(order) : 0
      }
    });

    logActivity({
      req,
      session,
      action: "CREATE",
      entity: "CATEGORY",
      entityId: category.id,
      entityName: category.name,
      summary: `Tạo danh mục mới: "${category.name}"`,
    }).catch(() => {});

    return NextResponse.json({ success: true, message: "Tạo danh mục thành công!", category });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Lỗi tạo danh mục." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const hasPerm = session.role === "SUPER_ADMIN" || session.role === "ADMIN" || (session.permissions && session.permissions.includes("categories"));
  if (!hasPerm) {
    return NextResponse.json({ success: false, message: "Bạn không có quyền chỉnh sửa danh mục." }, { status: 403 });
  }

  try {
    const { id, name, description, image, order } = await req.json();
    if (!id || !name) {
      return NextResponse.json({ success: false, message: "Thiếu ID hoặc tên danh mục." }, { status: 400 });
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
        image,
        order: order ? parseInt(order) : 0
      }
    });

    logActivity({
      req,
      session,
      action: "UPDATE",
      entity: "CATEGORY",
      entityId: category.id,
      entityName: category.name,
      summary: `Cập nhật danh mục: "${category.name}"`,
    }).catch(() => {});

    return NextResponse.json({ success: true, message: "Cập nhật danh mục thành công!", category });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Lỗi cập nhật danh mục." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  // Only SUPER_ADMIN and ADMIN can delete categories
  if (session.role !== "SUPER_ADMIN" && session.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Chỉ Quản trị viên cấp cao mới có quyền xóa danh mục." }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "Thiếu ID danh mục." }, { status: 400 });
    }

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, message: "Không tìm thấy danh mục để xóa." }, { status: 404 });
    }

    // Safety guard: prevent cascade deleting products
    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      return NextResponse.json({
        success: false,
        message: `Không thể xóa danh mục "${existing.name}" vì hiện đang có ${productCount} sản phẩm trực thuộc. Vui lòng chuyển hoặc xóa các sản phẩm đó trước khi xóa danh mục này!`
      }, { status: 400 });
    }

    await prisma.category.delete({ where: { id } });

    logActivity({
      req,
      session,
      action: "DELETE",
      entity: "CATEGORY",
      entityId: id,
      entityName: existing.name,
      summary: `Xóa danh mục: "${existing.name}"`,
    }).catch(() => {});

    return NextResponse.json({ success: true, message: `Đã xóa danh mục "${existing.name}".` });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Lỗi xóa danh mục: " + (error?.message || "") }, { status: 500 });
  }
}
