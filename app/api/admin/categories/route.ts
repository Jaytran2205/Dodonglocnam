import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";

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

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "Thiếu ID danh mục." }, { status: 400 });
    }

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Đã xóa danh mục." });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Lỗi xóa danh mục." }, { status: 500 });
  }
}
