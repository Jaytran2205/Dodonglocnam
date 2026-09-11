import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { DEFAULT_HIERARCHICAL_CATEGORIES, MainCategoryData } from "@/lib/subcategories-data";

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

    return NextResponse.json({
      success: true,
      message: "Đã lưu toàn bộ cấu hình thẻ nhóm con thành công!",
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
