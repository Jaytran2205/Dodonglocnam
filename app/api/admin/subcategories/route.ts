import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { DEFAULT_HIERARCHICAL_CATEGORIES, MainCategoryData } from "@/lib/subcategories-data";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: "subcategories_catalog" },
    });

    if (setting && setting.value) {
      try {
        const parsed = JSON.parse(setting.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const merged = parsed.map((cat: any) => {
            const def = DEFAULT_HIERARCHICAL_CATEGORIES.find((d) => d.slug === cat.slug);
            return {
              ...cat,
              banner: cat.banner || def?.banner || "/images/trong-dong-viet-nam.jpg",
            };
          });
          return NextResponse.json({ success: true, data: merged });
        }
      } catch (err) {
        console.error("Parse admin subcategories_catalog error:", err);
      }
    }

    return NextResponse.json({
      success: true,
      data: DEFAULT_HIERARCHICAL_CATEGORIES,
    });
  } catch (error: any) {
    console.error("Admin GET Subcategories Error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi tải danh mục thẻ con", data: DEFAULT_HIERARCHICAL_CATEGORIES },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const hasPerm = session.role === "SUPER_ADMIN" || session.role === "ADMIN" || (session.permissions && session.permissions.includes("categories"));
  if (!hasPerm) {
    return NextResponse.json({ success: false, message: "Bạn không có quyền quản lý danh mục thẻ con." }, { status: 403 });
  }

  try {
    const { catalog } = await req.json();

    if (!catalog || !Array.isArray(catalog) || catalog.length === 0) {
      return NextResponse.json(
        { success: false, message: "Dữ liệu danh mục không hợp lệ hoặc rỗng." },
        { status: 400 }
      );
    }

    const slugSet = new Set<string>();
    for (const cat of catalog) {
      if (!cat || typeof cat !== "object" || !cat.slug || typeof cat.slug !== "string" || !cat.name || typeof cat.name !== "string") {
        return NextResponse.json(
          { success: false, message: "Mỗi danh mục phải có định danh slug và tên hợp lệ." },
          { status: 400 }
        );
      }
      if (slugSet.has(cat.slug)) {
        return NextResponse.json(
          { success: false, message: `Slug danh mục bị trùng lặp: ${cat.slug}` },
          { status: 400 }
        );
      }
      slugSet.add(cat.slug);
    }

    // 1. Save to Database Setting table (persistent source of truth across Vercel deployments)
    await prisma.setting.upsert({
      where: { key: "subcategories_catalog" },
      update: {
        value: JSON.stringify(catalog),
        updatedAt: new Date(),
      },
      create: {
        key: "subcategories_catalog",
        value: JSON.stringify(catalog),
        group: "GENERAL",
        description: "Danh sách thẻ nhóm sản phẩm con (Subcategories) hiển thị trên web",
      },
    });

    // 2. Purge Next.js Cache for storefront pages
    try {
      revalidatePath("/san-pham", "layout");
      revalidatePath("/qua-tang", "layout");
      revalidatePath("/admin/categories");
    } catch (cacheErr) {
      console.warn("Revalidate cache warning:", cacheErr);
    }

    return NextResponse.json({
      success: true,
      message: "Đã lưu toàn bộ cấu hình thẻ nhóm con (bao gồm tất cả thẻ con cấp cuối) thành công!",
      data: catalog,
    });
  } catch (error: any) {
    console.error("Save Subcategories Error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi lưu danh mục thẻ con: " + error.message },
      { status: 500 }
    );
  }
}
