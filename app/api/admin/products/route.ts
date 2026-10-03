import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity-logger";

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
    const { name, slug: clientSlug, price, originalPrice, material, dimensions, weight, shortDescription, description, images, isFeatured, inStock, categoryId, subCategoryId, categoryIds, subCategoryIds, tags } = data;

    if (!name || !categoryId) {
      return NextResponse.json({ success: false, message: "Tên sản phẩm và danh mục là bắt buộc." }, { status: 400 });
    }

    const rawSlug = (clientSlug || name)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const existingProductWithSlug = await prisma.product.findUnique({ where: { slug: rawSlug } });
    const slug = existingProductWithSlug ? `${rawSlug}-${Date.now().toString().slice(-4)}` : rawSlug;

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
        categoryId,
        subCategoryId: subCategoryId || null,
        categoryIds: categoryIds ? (typeof categoryIds === "string" ? categoryIds : JSON.stringify(categoryIds)) : null,
        subCategoryIds: subCategoryIds ? (typeof subCategoryIds === "string" ? subCategoryIds : JSON.stringify(subCategoryIds)) : null,
        tags: tags || null
      },
      include: { category: true }
    });

    try { revalidatePath("/", "layout"); } catch {}

    logActivity({
      req,
      session,
      action: "CREATE",
      entity: "PRODUCT",
      entityId: product.id,
      entityName: product.name,
      summary: `Tạo sản phẩm mới: "${product.name}"` + (product.price ? ` (${product.price.toLocaleString("vi-VN")}đ)` : ""),
      details: { category: product.category?.name, inStock: product.inStock },
    }).catch(() => {});

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
    const { id } = data;

    if (!id) {
      return NextResponse.json({ success: false, message: "Thiếu ID sản phẩm." }, { status: 400 });
    }

    const updateData: any = {};

    if (data.name !== undefined) {
      if (typeof data.name !== "string" || !data.name.trim()) {
        return NextResponse.json({ success: false, message: "Tên sản phẩm không được để trống." }, { status: 400 });
      }
      updateData.name = data.name.trim();
    }
    if (data.price !== undefined) {
      updateData.price = data.price !== null && data.price !== "" ? parseFloat(data.price) : null;
    }
    if (data.originalPrice !== undefined) {
      updateData.originalPrice = data.originalPrice !== null && data.originalPrice !== "" ? parseFloat(data.originalPrice) : null;
    }
    if (data.material !== undefined) updateData.material = data.material || null;
    if (data.dimensions !== undefined) updateData.dimensions = data.dimensions || null;
    if (data.weight !== undefined) updateData.weight = data.weight || null;
    if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription || null;
    if (data.description !== undefined) updateData.description = data.description || null;
    if (data.images !== undefined) {
      updateData.images = typeof data.images === "string" ? data.images : JSON.stringify(data.images || []);
    }
    if (data.isFeatured !== undefined) updateData.isFeatured = Boolean(data.isFeatured);
    if (data.inStock !== undefined) updateData.inStock = Boolean(data.inStock);
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.subCategoryId !== undefined) updateData.subCategoryId = data.subCategoryId || null;
    if (data.categoryIds !== undefined) {
      updateData.categoryIds = data.categoryIds ? (typeof data.categoryIds === "string" ? data.categoryIds : JSON.stringify(data.categoryIds)) : null;
    }
    if (data.subCategoryIds !== undefined) {
      updateData.subCategoryIds = data.subCategoryIds ? (typeof data.subCategoryIds === "string" ? data.subCategoryIds : JSON.stringify(data.subCategoryIds)) : null;
    }
    if (data.tags !== undefined) updateData.tags = data.tags || null;
    if (data.slug !== undefined && typeof data.slug === "string" && data.slug.trim()) {
      const cleanSlug = data.slug
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      const existingProductWithSlug = await prisma.product.findFirst({
        where: { slug: cleanSlug, NOT: { id } },
      });
      if (!existingProductWithSlug) {
        updateData.slug = cleanSlug;
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { category: true }
    });

    try { revalidatePath("/", "layout"); } catch {}

    logActivity({
      req,
      session,
      action: "UPDATE",
      entity: "PRODUCT",
      entityId: product.id,
      entityName: product.name,
      summary: `Cập nhật sản phẩm: "${product.name}"` + (product.price ? ` (${product.price.toLocaleString("vi-VN")}đ)` : ""),
      details: {
        updatedFields: Object.keys(updateData),
        price: product.price,
        inStock: product.inStock,
        isFeatured: product.isFeatured,
        material: product.material,
        dimensions: product.dimensions,
        category: product.category?.name,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, message: "Cập nhật sản phẩm thành công!", product });
  } catch (error: any) {
    console.error("Update Product Error:", error);
    return NextResponse.json({ success: false, message: "Lỗi cập nhật sản phẩm: " + (error?.message || "") }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  return PUT(req);
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

    const existing = await prisma.product.findUnique({
      where: { id },
      select: { name: true, price: true, categoryId: true },
    });
    await prisma.product.delete({ where: { id } });
    try { revalidatePath("/", "layout"); } catch {}

    logActivity({
      req,
      session,
      action: "DELETE",
      entity: "PRODUCT",
      entityId: id,
      entityName: existing?.name || id,
      summary: `Xóa sản phẩm: "${existing?.name || id}" khỏi hệ thống`,
      details: {
        deletedProductId: id,
        deletedProductName: existing?.name,
        price: existing?.price,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, message: "Đã xóa sản phẩm." });
  } catch (error: any) {
    console.error("Delete Product Error:", error);
    return NextResponse.json({ success: false, message: "Lỗi xóa sản phẩm." }, { status: 500 });
  }
}
