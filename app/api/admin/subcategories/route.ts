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

  try {
    const { catalog } = await req.json();

    if (!catalog || !Array.isArray(catalog)) {
      return NextResponse.json(
        { success: false, message: "Dữ liệu danh mục không hợp lệ" },
        { status: 400 }
      );
    }

    // 1. Save to Database Setting table
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

    // 2. Synchronize directly to lib/subcategories-data.ts source file on disk
    try {
      const filePath = path.join(process.cwd(), "lib", "subcategories-data.ts");
      const fileCode = `export interface DetailCategoryItem {
  id: string;
  name: string;
  keyword: string;
  image: string;
  aliases?: string[];
}

export interface SubCategoryItem {
  id: string;
  name: string;
  keyword: string;
  image: string;
  aliases?: string[];
  children?: DetailCategoryItem[];
}

export interface MainCategoryData {
  name: string;
  slug: string;
  aliases?: string[];
  banner?: string;
  description?: string;
  subCategories: SubCategoryItem[];
}

export const DEFAULT_HIERARCHICAL_CATEGORIES: MainCategoryData[] = ${JSON.stringify(catalog, null, 2)};

export function findMainCategory(catSlug: string): MainCategoryData | undefined {
  return DEFAULT_HIERARCHICAL_CATEGORIES.find(
    (c) => c.slug === catSlug || (c.aliases && c.aliases.includes(catSlug))
  );
}

export function findSubCategory(catSlug: string, subSlug: string): SubCategoryItem | undefined {
  const cat = findMainCategory(catSlug);
  if (!cat) return undefined;
  return cat.subCategories.find(
    (s) => s.id === subSlug || (s.aliases && s.aliases.includes(subSlug))
  );
}

export function findDetailCategory(
  catSlug: string,
  subSlug: string,
  detailSlug: string
): DetailCategoryItem | undefined {
  const sub = findSubCategory(catSlug, subSlug);
  if (!sub || !sub.children) return undefined;
  return sub.children.find(
    (d) => d.id === detailSlug || (d.aliases && d.aliases.includes(detailSlug))
  );
}
`;
      fs.writeFileSync(filePath, fileCode, "utf-8");
    } catch (fsError) {
      console.warn("Could not write lib/subcategories-data.ts on disk:", fsError);
    }

    // 3. Purge Next.js Cache for storefront pages
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
