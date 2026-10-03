import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity-logger";

function parseBool(val: any, fallback = false): boolean {
  if (typeof val === "boolean") return val;
  if (typeof val === "string") {
    const lower = val.trim().toLowerCase();
    if (lower === "true" || lower === "1") return true;
    if (lower === "false" || lower === "0") return false;
  }
  if (typeof val === "number") return val !== 0;
  return fallback;
}

function parsePrice(val: any): { valid: boolean; value: number | null } {
  if (val === undefined || val === null || val === "") return { valid: true, value: null };
  const num = typeof val === "number" ? val : parseFloat(String(val).replace(/,/g, ""));
  if (isNaN(num) || num < 0) return { valid: false, value: null };
  return { valid: true, value: num };
}

export async function GET(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const hasPerm = session.role === "SUPER_ADMIN" || session.role === "ADMIN" || (session.permissions && session.permissions.includes("products"));
  if (!hasPerm) {
    return NextResponse.json({ success: false, message: "Bạn không có quyền xem danh sách sản phẩm." }, { status: 403 });
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

  const hasPerm = session.role === "SUPER_ADMIN" || session.role === "ADMIN" || (session.permissions && session.permissions.includes("products"));
  if (!hasPerm) {
    return NextResponse.json({ success: false, message: "Bạn không có quyền tạo sản phẩm." }, { status: 403 });
  }

  try {
    const data = await req.json();
    const { name, slug: clientSlug, price, originalPrice, material, dimensions, weight, shortDescription, description, images, isFeatured, inStock, categoryId, subCategoryId, categoryIds, subCategoryIds, tags } = data;

    if (!name || !categoryId) {
      return NextResponse.json({ success: false, message: "Tên sản phẩm và danh mục là bắt buộc." }, { status: 400 });
    }

    const parsedPrice = parsePrice(price);
    if (!parsedPrice.valid) {
      return NextResponse.json({ success: false, message: "Giá bán sản phẩm phải là số không âm." }, { status: 400 });
    }
    const parsedOrigPrice = parsePrice(originalPrice);
    if (!parsedOrigPrice.valid) {
      return NextResponse.json({ success: false, message: "Giá gốc sản phẩm phải là số không âm." }, { status: 400 });
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
        price: parsedPrice.value,
        originalPrice: parsedOrigPrice.value,
        material,
        dimensions,
        weight,
        shortDescription,
        description,
        images: typeof images === "string" ? images : JSON.stringify(images || ["/images/artisan-foundry.jpg"]),
        isFeatured: parseBool(isFeatured, false),
        inStock: parseBool(inStock, true),
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

  const hasPerm = session.role === "SUPER_ADMIN" || session.role === "ADMIN" || (session.permissions && session.permissions.includes("products"));
  if (!hasPerm) {
    return NextResponse.json({ success: false, message: "Bạn không có quyền cập nhật sản phẩm." }, { status: 403 });
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
      const parsedPrice = parsePrice(data.price);
      if (!parsedPrice.valid) {
        return NextResponse.json({ success: false, message: "Giá bán sản phẩm phải là số không âm." }, { status: 400 });
      }
      updateData.price = parsedPrice.value;
    }
    if (data.originalPrice !== undefined) {
      const parsedOrigPrice = parsePrice(data.originalPrice);
      if (!parsedOrigPrice.valid) {
        return NextResponse.json({ success: false, message: "Giá gốc sản phẩm phải là số không âm." }, { status: 400 });
      }
      updateData.originalPrice = parsedOrigPrice.value;
    }
    if (data.material !== undefined) updateData.material = data.material || null;
    if (data.dimensions !== undefined) updateData.dimensions = data.dimensions || null;
    if (data.weight !== undefined) updateData.weight = data.weight || null;
    if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription || null;
    if (data.description !== undefined) updateData.description = data.description || null;
    if (data.images !== undefined) {
      updateData.images = typeof data.images === "string" ? data.images : JSON.stringify(data.images || []);
    }
    if (data.isFeatured !== undefined) updateData.isFeatured = parseBool(data.isFeatured, false);
    if (data.inStock !== undefined) updateData.inStock = parseBool(data.inStock, true);
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
      if (existingProductWithSlug) {
        return NextResponse.json({
          success: false,
          message: `Đường dẫn (slug) "${cleanSlug}" đã được sử dụng bởi sản phẩm "${existingProductWithSlug.name}". Vui lòng chọn đường dẫn khác.`
        }, { status: 409 });
      }
      updateData.slug = cleanSlug;
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

  const hasPerm = session.role === "SUPER_ADMIN" || session.role === "ADMIN" || (session.permissions && session.permissions.includes("products"));
  if (!hasPerm) {
    return NextResponse.json({ success: false, message: "Bạn không có quyền xóa sản phẩm." }, { status: 403 });
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
