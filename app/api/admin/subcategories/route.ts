import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { DEFAULT_HIERARCHICAL_CATEGORIES, MainCategoryData } from "@/lib/subcategories-data";
import { loadCatalog } from "@/lib/catalog";
import { revalidateTag, revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export async function GET() {
  try { return NextResponse.json({ success: true, data: await loadCatalog() }); }
  catch (error) { console.error("Catalogue error:", error); return NextResponse.json({ success: false, message: "Không tải được danh mục." }, { status: 500 }); }
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
      if (!cat || typeof cat !== "object" || !cat.slug || typeof cat.slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cat.slug) || !cat.name || typeof cat.name !== "string") {
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

    for (const cat of catalog) {
      if (!Array.isArray(cat.subCategories) || !cat.name.trim()) return NextResponse.json({ success: false, message: "Tên và danh sách danh mục con không hợp lệ." }, { status: 400 });
      const validateItems = (items: any[]) => {
        const ids = new Set<string>();
        return items.every(item => item && typeof item.id === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id) && !ids.has(item.id) && !!ids.add(item.id) && typeof item.name === "string" && item.name.trim() && typeof item.keyword === "string" && typeof item.image === "string");
      };
      if (!validateItems(cat.subCategories) || cat.subCategories.some((sub: any) => sub.children && (!Array.isArray(sub.children) || !validateItems(sub.children)))) {
        return NextResponse.json({ success: false, message: "Danh mục con phải có tên, đường dẫn hợp lệ và không trùng nhau." }, { status: 400 });
      }
    }
    await prisma.$transaction([
    // 1. Save to Database Setting table (persistent source of truth across Vercel deployments)
    prisma.setting.upsert({
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
    }),
    ...catalog.map((cat: MainCategoryData) => prisma.category.updateMany({
      where: { slug: { in: [cat.slug, ...(cat.aliases || [])] } },
      data: { name: cat.name.trim(), ...(cat.description !== undefined ? { description: cat.description } : {}) },
    })),
    ]);
    revalidateTag("catalog"); revalidateTag("categories"); revalidateTag("settings");
    revalidatePath("/", "layout");
    revalidatePath("/sitemap.xml");

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
