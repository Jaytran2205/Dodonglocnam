import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");
  const search = searchParams.get("search");

  const where: any = {};
  if (categoryId) where.categoryId = categoryId;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } }
    ];
  }

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ success: true, products });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { name, price, originalPrice, material, dimensions, weight, shortDescription, description, images, isFeatured, inStock, categoryId } = data;

    if (!name || !categoryId) {
      return NextResponse.json({ success: false, message: "Tên sản phẩm và danh mục là bắt buộc." }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-") + "-" + Date.now().toString().slice(-4);

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        price: price ? parseFloat(price) : null,
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        material,
        dimensions,
        weight,
        shortDescription,
        description,
        images: typeof images === "string" ? images : JSON.stringify(images || ["/images/artisan-foundry.jpg"]),
        isFeatured: Boolean(isFeatured),
        inStock: inStock !== undefined ? Boolean(inStock) : true,
        categoryId
      }
    });

    return NextResponse.json({ success: true, message: "Tạo sản phẩm thành công!", product });
  } catch (error: any) {
    console.error("Create Product Error:", error);
    return NextResponse.json({ success: false, message: "Lỗi tạo sản phẩm." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { id, name, price, originalPrice, material, dimensions, weight, shortDescription, description, images, isFeatured, inStock, categoryId } = data;

    if (!id) {
      return NextResponse.json({ success: false, message: "Thiếu ID sản phẩm." }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        price: price ? parseFloat(price) : null,
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        material,
        dimensions,
        weight,
        shortDescription,
        description,
        images: typeof images === "string" ? images : JSON.stringify(images || []),
        isFeatured: Boolean(isFeatured),
        inStock: inStock !== undefined ? Boolean(inStock) : true,
        categoryId
      }
    });

    return NextResponse.json({ success: true, message: "Cập nhật sản phẩm thành công!", product });
  } catch (error: any) {
    console.error("Update Product Error:", error);
    return NextResponse.json({ success: false, message: "Lỗi cập nhật sản phẩm." }, { status: 500 });
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
      return NextResponse.json({ success: false, message: "Thiếu ID sản phẩm." }, { status: 400 });
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Đã xóa sản phẩm." });
  } catch (error: any) {
    console.error("Delete Product Error:", error);
    return NextResponse.json({ success: false, message: "Lỗi xóa sản phẩm." }, { status: 500 });
  }
}
